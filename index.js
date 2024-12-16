const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const createError = require('http-errors');
const app = express();
const dotenv = require('dotenv').config();

const UnicornRouter = require('./Routes/Unicorn.route');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Usar la variable de entorno MONGODB_URI desde el archivo .env
mongoose.connect(process.env.MONGODB_URI, {
    dbName: 'unicornsDB'
}).then(() => {
    console.log('MongoDB HAS CONNECTED....');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

app.use('/unicorns', UnicornRouter);

app.use((req, res, next) => {
    next(createError(404, "Not Found"));
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    });
});

const PORT = process.env.PORT || 3000; // Usar la variable de entorno PORT
app.listen(PORT, () => {
    console.log('server started on port ', PORT);
});
