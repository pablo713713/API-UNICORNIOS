const express = require('express');
const UnicornRouter = express.Router();
const UnicornController = require('../Controllers/Unicorn.controller');

UnicornRouter.get('/', UnicornController.getAllUnicorns);
UnicornRouter.get('/name/:name', UnicornController.getUnicornByName);
UnicornRouter.get('/id/:id', UnicornController.getUnicornByID);
UnicornRouter.get('/filter/', UnicornController.getUnicornFiltered);

UnicornRouter.post('/', UnicornController.createNewUnicorn);

UnicornRouter.delete('/:id', UnicornController.deleteUnicornByID);

UnicornRouter.patch('/:id', UnicornController.updateUnicornByID);

module.exports = UnicornRouter;
