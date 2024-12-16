const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UnicornSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: { 
        type: [String], 
        required: true 
    },
    description: { 
        type: [String], 
        required: true 
    },
    image: {
        type: String,
        required: true
    },
    img: {
        data: Buffer, 
        contentType: String 
    }
});

const Unicorn = mongoose.model('Unicorn', UnicornSchema);

module.exports = Unicorn;
