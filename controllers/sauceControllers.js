/* eslint-disable no-underscore-dangle */
const Sauce = require('../models/Sauce');
const { createError, clearImage } = require('../helpers');
const { minifyAndResize } = require('../middlewares/imageUploader');

exports.getAllSauces = (_, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getSauceById = (req, res, next) => {
  const { id } = req.params;
  Sauce.findById(id)
    .then((sauce) => {
      if (!sauce) throw createError(404, 'Sauce not found');
      res.status(200).json(sauce);
    })
    .catch((err) => {
      next(err);
    });
};

exports.createSauce = (req, res, next) => {
  if (req.errors && Object.keys(req.errors).length) throw createError(422, 'Validation failed', req.errors);
  const {
    userId,
    manufacturer,
    name,
    description,
    mainPepper,
    heat,
  } = JSON.parse(req.body.sauce);

  const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/').split('.')[0]}-optimized.jpeg` : '';
  const sauce = new Sauce({
    userId,
    manufacturer,
    name,
    description,
    imageUrl,
    mainPepper,
    heat,
  });
  if (req.file) {
    minifyAndResize(req.file, 560)
      .catch(() => {
        next(createError(422, 'Image error'));
      });
  }
  sauce.save()
    .then(() => {
      res.status(201).json({ message: 'Sauce is created' });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateSauce = (req, res, next) => {
  if (req.errors && Object.keys(req.errors).length) throw createError(422, 'Validation failed', req.errors);

  const {
    userId,
    manufacturer,
    name,
    description,
    mainPepper,
    heat,
  } = JSON.parse(req.body.sauce);

  const { id } = req.params;

  Sauce.findById(id)
    .then((sauce) => {
      if (!sauce) throw createError(404, 'Sauce not found');
      Object.assign(sauce, {
        userId,
        manufacturer,
        name,
        description,
        mainPepper,
        heat,
      });
      if (req.file) {
        if (sauce.imageUrl) clearImage(sauce.imageUrl);
        Object.assign(sauce, { imageUrl: `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/').split('.')[0]}-optimized.jpeg` });
        minifyAndResize(req.file, 560)
          .catch(() => {
            next(createError(422, 'Image error'));
          });
      }
      sauce.save();
    }).then(() => {
      res.status(200).json({ message: 'Sauce is updated' });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteSauce = (req, res, next) => {
  const { id } = req.params;
  let currentImageUrl;
  Sauce.findById(id)
    .then((sauce) => {
      if (!sauce) throw createError(404, 'Sauce not found');
      currentImageUrl = sauce.imageUrl;
      return sauce.remove();
    })
    .then(() => {
      clearImage(currentImageUrl);
      res.status(200).json({ message: 'Sauce is removed' });
    })
    .catch((err) => {
      next(err);
    });
};

function updateRate(userId, sauce, like) {
  const {
    likes, dislikes, usersLiked, usersDisliked,
  } = sauce;
  switch (like) {
    case 0:
      if (usersLiked.includes(userId)) {
        return Object.assign(sauce, {
          usersLiked: usersLiked.filter((id) => id.toString() !== userId),
          likes: likes - 1,
        });
      }
      if (usersDisliked.includes(userId)) {
        return Object.assign(sauce, {
          usersDisliked: usersDisliked.filter((id) => id.toString() !== userId),
          dislikes: dislikes - 1,
        });
      }
      return sauce;
    case 1:
      if (usersLiked.includes(userId)) return sauce;
      return Object.assign(sauce, {
        usersLiked: [...usersLiked, userId],
        likes: likes + 1,
      });
    case -1:
      if (usersDisliked.includes(userId)) return sauce;
      return Object.assign(sauce, {
        usersDisliked: [...usersDisliked, userId],
        dislikes: dislikes + 1,
      });
    default:
      return sauce;
  }
}

exports.rateSauce = (req, res, next) => {
  const { id } = req.params;
  const { userId, like } = req.body;
  Sauce.findById(id)
    .then((sauce) => {
      if (!sauce) throw createError(404, 'Sauce not found');
      const votedSauce = updateRate(userId, sauce, like);
      votedSauce.save();
    })
    .then(() => {
      res.status(200).json({ message: 'You voted successfully' });
    })
    .catch((err) => {
      next(err);
    });
};
