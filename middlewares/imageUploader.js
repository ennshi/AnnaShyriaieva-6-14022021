/* eslint-disable no-param-reassign */
const fs = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const sharp = require('sharp');

const errorHandler = require('./errorHandler');

const storage = multer.diskStorage({
  destination: (_, _file, cb) => {
    cb(null, path.join('public', 'img'));
  },
  filename: (_, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const fileFilter = (_, file, cb) => {
  if (
    file.mimetype === 'image/png'
        || file.mimetype === 'image/jpg'
        || file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Please upload right format (png, jpg, jpeg).'));
  }
};

exports.uploadPhoto = (req, res, next) => {
  multer({
    limits: {
      fileSize: 5000000,
    },
    storage,
    fileFilter,
  })
    .single('image')(req, res, (err) => {
      if (err) {
        err.statusCode = 422;
        return errorHandler(err, req, res);
      }
      return next();
    });
};

exports.minifyAndResize = async (img, size) => {
  const newPath = path.resolve(path.dirname(img.path), `${img.filename.split('.')[0]}-optimized.jpeg`);
  await sharp(img.path)
    .jpeg({
      quality: 80,
    })
    .resize(size, size)
    .toFile(newPath);
  fs.unlinkSync(img.path);
};
