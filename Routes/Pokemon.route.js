const express = require('express');
const PokemonRouter = express.Router();
const PokemonController = require('../Controllers/Pokemon.controller');
const Pokemon = require('../Models/Pokemon.model');


PokemonRouter.get('/', PokemonController.getAllPokemon);
PokemonRouter.post('/', PokemonController.createNewPokemon);
module.exports = PokemonRouter;