const express = require('express');
const {
  getSauceById, getAllSauces, createSauce, updateSauce, deleteSauce, rateSauce,
} = require('../controllers/sauceControllers');
const { uploadPhoto } = require('../middlewares/imageUploader');

const router = express.Router();

router.get('/', getAllSauces);
router.get('/:id', getSauceById);

router.post('/', uploadPhoto, createSauce);
router.put('/:id', uploadPhoto, updateSauce);
router.delete('/:id', deleteSauce);

router.post('/:id/like', rateSauce);

module.exports = router;
