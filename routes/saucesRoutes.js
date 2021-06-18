const express = require('express');
const { getSauceById, getAllSauces } = require('../controllers/sauceControllers');

const router = express.Router();

router.get('/', getAllSauces);
router.get('/:id', getSauceById);

router.post('/', () => {});
router.post('/:id', () => {});

router.put('/:id', () => {});
router.delete('/:id', () => {});

module.exports = router;
