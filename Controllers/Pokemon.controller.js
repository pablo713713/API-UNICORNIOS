const mongoose = require('mongoose');
const createError = require('http-errors');
const Pokemon = require('../Models/Pokemon.model');

module.exports = {
    getAllPokemon: async(req,res,next) =>{
        try{
            const results = await Pokemon.find({}, {__v:0});
            res.send(results);
        } catch(error) {
            console.log(error.message)
        }
    },
    createNewPokemon: async(req,res,next) => {
        try{
            const pokemon = new Pokemon(req.body);
            const result = await pokemon.save();
            res.send(result);
        } catch(error) {
            console.log(error.message);
            if(error.name == 'ValidationError'){
                next(createError(422, error.message));
                return;
            }
            next(error);
        }
    },
    getPokemonByName: async(req,res,next) => {
        const name = req.params.name;
        try{
            const pokemon = await Pokemon.findOne({name:name});
            if(!pokemon){
                throw createError(404, "Pokemon Not Found");
            }
            res.json(pokemon);
        }catch(error) {
            console.log(erorr.message);
            if(error instanceof mongoose.CastError){
                next(createError(400, "Invalid Name"));
                return;
            }
            next(error);
        }
    },
    getPokemonByID: async(req,res,next) => {
        const id = req.params.id;
        try{
            const pokemon = await Pokemon.findById(id);
            if(!pokemon){
                throw createError(404, "Pokemon Not Found");
            }
            res.json(pokemon);
        }catch(error) {
            console.log(erorr.message);
            if(error instanceof mongoose.CastError){
                next(createError(400, "Invalid Name"));
                return;
            }
            next(error);
        }
    },
    deletePokemonByID: async(req,res,next) =>{
        const id = req.params.id;
        try{
            const result = await Pokemon.findByIdAndDelete(id);
            if(!result){
                throw createError(404, "Pokemon does not exist.");
            }
            res.send(result);
        }catch(error){
            console.log(error.message);
            if(error instanceof mongoose.CastError){
                next(createError(400,"Invalid Name"));
                return;
            }
            next(error);
        }
    }
};