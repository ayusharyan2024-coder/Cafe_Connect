const express = require('express');
const menuController = require('../controllers/menuController');

const router = express.Router();

router.get('/', menuController.getAll);
router.post('/', menuController.create);
router.put('/:id', menuController.update);
router.delete('/:id', menuController.delete);

module.exports = router;
