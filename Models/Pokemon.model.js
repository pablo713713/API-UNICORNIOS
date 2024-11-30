const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PokemonSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: { type: [String], required: true },
    base: {
      HP: { type: Number, default: 0},
      Attack: { type: Number, default: 0},
      Defense: { type: Number, default: 0},
      Speed: { type: Number, default: 0}
    },
    evolution: {
      prev: { type: mongoose.Schema.Types.ObjectId, ref: 'Pokemon', default: null },
      next: { type: [mongoose.Schema.Types.ObjectId], ref: 'Pokemon', default: [] }
    },
    generation: { type: Number, required: true },
    legendary: { type: Boolean, default: false },
    image: {
      type: String,
      required: true
    }

});

const Pokemon = mongoose.model('Pokemon', PokemonSchema);

module.exports = Pokemon;