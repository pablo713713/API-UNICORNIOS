const mongoose = require('mongoose');
const axios = require('axios');
const dotenv = require('dotenv').config();

const UnicornSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: [String], required: true },
    description: { type: [String], required: true },
    image: { type: String, required: true },
    img: {
        data: Buffer,
        contentType: String
    }
});

const Unicorn = mongoose.model('Unicorn', UnicornSchema);

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

        // Find all Unicorns
        const unicorns = await Unicorn.find({});
        console.log(`Found ${unicorns.length} unicorns in the database.`);

        for (const unicorn of unicorns) {
            if (!unicorn.img || !unicorn.img.data) {
                console.log(`Processing unicorn: ${unicorn.name}`);

                try {
                    // Fetch the image from the URL
                    const response = await axios.get(unicorn.image, {
                        responseType: 'arraybuffer'
                    });

                    // Update the img field
                    unicorn.img = {
                        data: Buffer.from(response.data),
                        contentType: response.headers['content-type']
                    };

                    // Save the updated Unicorn document
                    await unicorn.save();
                    console.log(`Updated unicorn: ${unicorn.name}`);
                } catch (error) {
                    console.error(`Failed to fetch or update image for ${unicorn.name}:`, error.message);
                }
            } else {
                console.log(`Unicorn ${unicorn.name} already has an img attribute.`);
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
