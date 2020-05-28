'use strict'

const express = require('express');
const multipart = require('connect-multiparty');
const ArtistController = require('../controllers/artist-controller');
const md_auth = require('../middlewares/authenticated');

var md_upload = multipart({ uploadDir: './uploads/artists' });

const route = express.Router();

route.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);   
route.post('/register-artist', md_auth.ensureAuth, ArtistController.saveArtist);
route.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getArtists);  
route.put('/update-artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
route.delete('/delete-artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);
route.post('/upload-image-artist/:id', [md_auth.ensureAuth, md_upload], ArtistController.uploadImage);
route.get('/get-image-artist/:imageFile',  ArtistController.getImageFile);


module.exports = route;