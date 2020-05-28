'use strict'

const express = require('express');
const multipart = require('connect-multiparty');
const AlbumController = require('../controllers/album-controller');
const md_auth = require('../middlewares/authenticated');

var md_upload = multipart({ uploadDir: './uploads/albums' });

const route = express.Router();

route.post('/register-album', md_auth.ensureAuth , AlbumController.saveAlbum);
route.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);   
route.get('/albums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums); 
route.put('/update-album/:id', md_auth.ensureAuth , AlbumController.updateAlbum);
route.delete('/delete-album/:id', md_auth.ensureAuth , AlbumController.deleteAlbum);
route.post('/upload-image-album/:id', [md_auth.ensureAuth, md_upload], AlbumController.uploadImage);
route.get('/get-image-album/:imageFile',  AlbumController.getImageFile);



module.exports = route;