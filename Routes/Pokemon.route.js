const express = require('express');
const PokemonRouter = express.Router();
const PokemonController = require('../Controllers/Pokemon.controller');


PokemonRouter.get('/', PokemonController.getAllPokemon);
PokemonRouter.get('/name/:name', PokemonController.getPokemonByName);
PokemonRouter.get('/id/:id', PokemonController.getPokemonByID);
PokemonRouter.get('/filter/', PokemonController.getPokemonFiltered);

PokemonRouter.post('/', PokemonController.createNewPokemon);

PokemonRouter.delete('/:id', PokemonController.deletePokemonByID);

PokemonRouter.patch('/:id', PokemonController.updatePokemonByID);

module.exports = PokemonRouter;