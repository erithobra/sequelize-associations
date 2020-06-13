const express = require('express');
const router = express.Router();//creates a router object
const ctrl = require('../controllers');

router.get('/', ctrl.fruits.index);
router.get('/new', ctrl.fruits.renderNew);
router.get('/:index', ctrl.fruits.show);
router.post('/', ctrl.fruits.postFruit);
router.delete('/:index', ctrl.fruits.removeFruit);
router.get('/:index/edit', ctrl.fruits.renderEdit);
router.put('/:index', ctrl.fruits.editFruit);

module.exports = router;

