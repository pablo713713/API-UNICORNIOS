const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const createError = require('http-errors');
const app = express();
const dotenv = require('dotenv').config();

const PokemonRouter = require('./Routes/Pokemon.route');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS
}).then(() => {
    console.log('MongoDB HAS CONNECTED....');
});

app.use('/pokemon', PokemonRouter);



app.use((req, res, next) =>{
    next(createError(404, "Not Found"));
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
});

app.listen(3000, () =>
    {
        console.log('server started on port 3000')
});