const express = require('express');
const {
  getSauceById, getAllSauces, createSauce, updateSauce, deleteSauce, rateSauce,
} = require('../controllers/sauceControllers');
const { uploadPhoto } = require('../middlewares/imageUploader');
const { isLoggedIn } = require('../middlewares/isLoggedIn');

const router = express.Router();

router.get('/', isLoggedIn, getAllSauces);
router.get('/:id', isLoggedIn, getSauceById);

router.post('/', isLoggedIn, uploadPhoto, createSauce);
router.put('/:id', isLoggedIn, uploadPhoto, updateSauce);
router.delete('/:id', isLoggedIn, deleteSauce);

router.post('/:id/like', isLoggedIn, rateSauce);

module.exports = router;
