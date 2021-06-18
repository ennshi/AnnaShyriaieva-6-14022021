const Sauce = require('../models/Sauce');
const { createError } = require('../helpers');

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
      if (!sauce) {
        throw createError(404, 'Restaurant not found');
      }
      res.status(200).json(sauce);
    })
    .catch((err) => {
      next(err);
    });
};
