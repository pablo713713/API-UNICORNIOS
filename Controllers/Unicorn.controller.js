const mongoose = require('mongoose');
const createError = require('http-errors');
const Unicorn = require('../Models/Unicorn.model');

module.exports = {
    getAllUnicorns: async (req, res, next) => {
        try {
            const results = await Unicorn.find({}, { __v: 0 });
            const updatedResults = results.map(unicorn => {
                const unicornObj = unicorn.toObject();
                if (unicornObj.img && unicornObj.img.data) {
                    unicornObj.img = `data:${unicornObj.img.contentType};base64,${unicornObj.img.data.toString('base64')}`;
                }
                return unicornObj;
            });
            res.send(updatedResults);
        } catch (error) {
            console.log(error.message);
        }
    },
    createNewUnicorn: async (req, res, next) => {
        try {
            const { img } = req.body;
            if (img && typeof img === 'string') {
                const [metadata, base64Data] = img.split(',');
                const contentType = metadata.match(/:(.*?);/)[1];
                req.body.img = {
                    data: Buffer.from(base64Data, 'base64'),
                    contentType,
                };
            }

            // Create and save the Unicorn
            const unicorn = new Unicorn(req.body);
            const result = await unicorn.save();
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
    getUnicornByName: async (req, res, next) => {
        const name = req.params.name;
        try {
            const unicorn = await Unicorn.findOne({ name: name });
            if (!unicorn) {
                throw createError(404, "Unicorn Not Found");
            }
            const unicornObj = unicorn.toObject();
            if (unicornObj.img && unicornObj.img.data) {
                unicornObj.img = `data:${unicornObj.img.contentType};base64,${unicornObj.img.data.toString('base64')}`;
            }
            res.json(unicornObj);
        } catch (error) {
            console.log(error.message);
            if (error instanceof mongoose.CastError) {
                next(createError(400, "Invalid Name"));
                return;
            }
            next(error);
        }
    },
    getUnicornFiltered: async (req, res, next) => {
        try {
            const filters = {};
            if (req.query.type) {
                filters.type = req.query.type;
            }
            if (req.query.name) {
                filters.name = { $regex: req.query.name, $options: 'i' };
            }

            const results = await Unicorn.find(filters);
            const updatedResults = results.map(unicorn => {
                const unicornObj = unicorn.toObject();
                if (unicornObj.img && unicornObj.img.data) {
                    unicornObj.img = `data:${unicornObj.img.contentType};base64,${unicornObj.img.data.toString('base64')}`;
                }
                return unicornObj;
            });
            res.send(updatedResults);
        } catch (error) {
            console.log(error.message);
        }
    },
    getUnicornByID: async (req, res, next) => {
        const id = req.params.id;
        try {
            const unicorn = await Unicorn.findById(id);
            if (!unicorn) {
                throw createError(404, "Unicorn Not Found");
            }
            const unicornObj = unicorn.toObject();
            if (unicornObj.img && unicornObj.img.data) {
                unicornObj.img = `data:${unicornObj.img.contentType};base64,${unicornObj.img.data.toString('base64')}`;
            }
            res.json(unicornObj);
        } catch (error) {
            console.log(error.message);
            if (error instanceof mongoose.CastError) {
                next(createError(400, "Invalid ID"));
                return;
            }
            next(error);
        }
    },
    deleteUnicornByID: async (req, res, next) => {
        const id = req.params.id;
        try {
            const result = await Unicorn.findByIdAndDelete(id);
            if (!result) {
                throw createError(404, "Unicorn does not exist.");
            }
            res.send(result);
        } catch (error) {
            console.log(error.message);
            if (error instanceof mongoose.CastError) {
                next(createError(400, "Invalid ID"));
                return;
            }
            next(error);
        }
    },
    updateUnicornByID: async (req, res, next) => {
        try {
            const id = req.params.id;
            const updateData = req.body;
            const result = await Unicorn.findOneAndUpdate({ _id: id }, updateData, { new: true });
            if (!result) {
                throw createError(404, "Unicorn does not exist");
            }
            res.send(result);
        } catch (error) {
            console.log(error.message);
            if (error instanceof mongoose.CastError) {
                return next(createError(400, "Invalid Unicorn ID"));
            }
            next(error);
        }
    }
};
