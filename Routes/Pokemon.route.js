const express = require('express');
const PokemonRouter = express.Router();
const PokemonController = require('../Controllers/Pokemon.controller');
const Pokemon = require('../Models/Pokemon.model');


PokemonRouter.get('/', PokemonController.getAllPokemon);
PokemonRouter.get('/:name', PokemonController.getPokemonByName);

PokemonRouter.post('/', PokemonController.createNewPokemon);

module.exports = PokemonRouter;