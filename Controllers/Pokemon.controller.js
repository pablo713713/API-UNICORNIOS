const mongoose = require('mongoose');
const createError = require('http-errors');
const Pokemon = require('../Models/Pokemon.model');

module.exports = {
    getAllPokemon: async(req,res,next) =>{
        try{
            const results = await Pokemon.find({}, {__v:0});
            const updatedResults = results.map(pokemon => {
                const pokemonObj = pokemon.toObject();
                if (pokemonObj.img && pokemonObj.img.data) {
                    pokemonObj.img = `data:${pokemonObj.img.contentType};base64,${pokemonObj.img.data.toString('base64')}`;
                }
                return pokemonObj;
            });
            res.send(updatedResults);
        } catch(error) {
            console.log(error.message)
        }
    },
    createNewPokemon: async (req, res, next) => {
        try {
            const { evolution, img } = req.body;
            if (img && typeof img === 'string') {
                const [metadata, base64Data] = img.split(',');
                const contentType = metadata.match(/:(.*?);/)[1];
                req.body.img = {
                    data: Buffer.from(base64Data, 'base64'),
                    contentType,
                };
            }
            // Ensure evolution.prev is converted to ObjectId if present
            if (evolution?.prev) {
                req.body.evolution.prev = new mongoose.Types.ObjectId(evolution.prev);
            }
    
            // Ensure evolution.next is converted to an array of ObjectIds if present
            if (evolution?.next?.length > 0) {
                req.body.evolution.next = evolution.next.map(id => new mongoose.Types.ObjectId(id));
            }
    
            // Create and save the Pokemon
            const pokemon = new Pokemon(req.body);
            const result = await pokemon.save();
    
            // Update the evolution relationships
            if (evolution?.prev) {
                await Pokemon.findByIdAndUpdate(evolution.prev, {
                    $addToSet: { "evolution.next": result._id }
                });
            }
    
            if (evolution?.next?.length > 0) {
                await Pokemon.updateMany(
                    { _id: { $in: evolution.next } },
                    { $set: { "evolution.prev": result._id } }
                );
            }
    
            res.status(201).send(result);
        } catch (error) {
            console.error(error.message);
            if (error.name === "ValidationError") {
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
            const pokemonObj = pokemon.toObject();
            if (pokemonObj.img && pokemonObj.img.data) {
                pokemonObj.img = `data:${pokemonObj.img.contentType};base64,${pokemonObj.img.data.toString('base64')}`;
            }
            res.json(pokemonObj);
        }catch(error) {
            console.log(error.message);
            if(error instanceof mongoose.CastError){
                next(createError(400, "Invalid Name"));
                return;
            }
            next(error);
        }
    },
    getPokemonFiltered: async(req,res,next) => {
        try{
            const filters = {};
            if(req.query.type){
                filters.type = req.query.type;
            }
            if(req.query.generation){
                filters.generation = parseInt(req.query.generation,10);
            }
            if(req.query.legendary){
                filters.legendary = req.query.legendary === 'true';
            }
            if (req.query.name) {
                filters.name = { $regex: req.query.name, $options: 'i' };
            }

            const results = await Pokemon.find(filters);
            const updatedResults = results.map(pokemon => {
                const pokemonObj = pokemon.toObject();
                if (pokemonObj.img && pokemonObj.img.data) {
                    pokemonObj.img = `data:${pokemonObj.img.contentType};base64,${pokemonObj.img.data.toString('base64')}`;
                }
                return pokemonObj;
            });
            res.send(updatedResults);
        }catch(error){
            console.log(error.message);
        }
    },

    getPokemonByID: async(req,res,next) => {
        const id = req.params.id;
        try{
            const pokemon = await Pokemon.findById(id);
            if(!pokemon){
                throw createError(404, "Pokemon Not Found");
            }
            const pokemonObj = pokemon.toObject();
            if (pokemonObj.img && pokemonObj.img.data) {
                pokemonObj.img = `data:${pokemonObj.img.contentType};base64,${pokemonObj.img.data.toString('base64')}`;
            }
            res.json(pokemonObj);
        }catch(error) {
            console.log(error.message);
            if(error instanceof mongoose.CastError){
                next(createError(400, "Invalid Name"));
                return;
            }
            next(error);
        }
    },
    deletePokemonByID: async (req, res, next) => {
        const id = req.params.id;
        try {
            // Check if the Pokémon exists
            const pokemonToDelete = await Pokemon.findById(id);
            if (!pokemonToDelete) {
                throw createError(404, "Pokemon does not exist.");
            }
    
            // Remove references to this Pokémon from other Pokémon's evolution fields
            await Pokemon.updateMany(
                { "evolution.next": id },
                { $pull: { "evolution.next": id } } // Remove from 'next' evolutions
            );
    
            await Pokemon.updateMany(
                { "evolution.prev": id },
                { $set: { "evolution.prev": null } } // Set 'prev' evolution to null
            );
    
            // Delete the Pokémon
            const result = await Pokemon.findByIdAndDelete(id);
    
            res.send(result); // Return deleted Pokémon details
        } catch (error) {
            console.log(error.message);
    
            if (error instanceof mongoose.CastError) {
                next(createError(400, "Invalid ID"));
                return;
            }
            next(error);
        }
    },
    updatePokemonByID: async(req,res,next)=>{
        try {
            const id = req.params.id;
            const updateData = req.body;
            const result = await Pokemon.findOneAndUpdate({ _id: id }, updateData, {new: true});
            if(!result) {
                throw createError(404, "Pokemon does not exist");
            }
            res.send(result);
        } catch(error) {
            console.log(error.message);
            if(error instanceof mongoose.CastError) {
                return next(createError(400, "Invalid Pokemon ID"));
            }
            next(error);
        }
    }
};