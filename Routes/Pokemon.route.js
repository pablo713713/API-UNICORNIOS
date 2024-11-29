const express = require('express');
const PokemonRouter = express.Router();
const PokemonController = require('../Controllers/Pokemon.controller');


PokemonRouter.get('/', PokemonController.getAllPokemon);
PokemonRouter.get('/name/:name', PokemonController.getPokemonByName);
PokemonRouter.get('/id/:id', PokemonController.getPokemonByID);

PokemonRouter.post('/', PokemonController.createNewPokemon);

PokemonRouter.delete('/:id', PokemonController.deletePokemonByID);

module.exports = PokemonRouter;