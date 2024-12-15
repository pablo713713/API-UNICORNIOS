const mongoose = require('mongoose');
const axios = require('axios');
const dotenv = require('dotenv').config();

const PokemonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: [String], required: true },
    base: {
        HP: { type: Number, default: 0 },
        Attack: { type: Number, default: 0 },
        Defense: { type: Number, default: 0 },
        Speed: { type: Number, default: 0 }
    },
    evolution: {
        prev: { type: mongoose.Schema.Types.ObjectId, ref: 'Pokemon', default: null },
        next: { type: [mongoose.Schema.Types.ObjectId], ref: 'Pokemon', default: [] }
    },
    generation: { type: Number, required: true },
    legendary: { type: Boolean, default: false },
    image: { type: String, required: true },
    img: {
        data: Buffer,
        contentType: String
    }
});

const Pokemon = mongoose.model('Pokemon', PokemonSchema);

async function updateImages() {
    try {
        // Connect to MongoDB
        mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.DB_NAME,
            user: process.env.DB_USER,
            pass: process.env.DB_PASS
        }).then(() => {
            console.log('MongoDB HAS CONNECTED....');
        });

        // Find all Pokémon
        const pokemons = await Pokemon.find({});
        console.log(`Found ${pokemons.length} Pokémon in the database.`);

        for (const pokemon of pokemons) {
            if (!pokemon.img || !pokemon.img.data) {
                console.log(`Processing Pokémon: ${pokemon.name}`);

                try {
                    // Fetch the image from the URL
                    const response = await axios.get(pokemon.image, {
                        responseType: 'arraybuffer'
                    });

                    // Update the img field
                    pokemon.img = {
                        data: Buffer.from(response.data),
                        contentType: response.headers['content-type']
                    };

                    // Save the updated Pokémon document
                    await pokemon.save();
                    console.log(`Updated Pokémon: ${pokemon.name}`);
                } catch (error) {
                    console.error(`Failed to fetch or update image for ${pokemon.name}:`, error.message);
                }
            } else {
                console.log(`Pokémon ${pokemon.name} already has an img attribute.`);
            }
        }

        console.log('Image update process completed.');
    } catch (error) {
        console.error('Error during the update process:', error.message);
    } finally {
        mongoose.connection.close();
    }
}

updateImages();
