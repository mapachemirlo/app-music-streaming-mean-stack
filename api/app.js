'use strict'

const express = require('express');
const bodyParser = require('body-parser');

// Cargar rutas
const user_routes = require('./routes/user-route');
const artist_route = require('./routes/artist-route');
const album_route = require('./routes/album-route');
const song_route = require('./routes/song-route');


const app = express();


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use((req, res, next) => {
    
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});

// rutas base
app.use('/api', user_routes);
app.use('/api', artist_route);
app.use('/api', album_route);
app.use('/api', song_route);

module.exports = app;