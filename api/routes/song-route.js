'use strict'

const express = require('express');
const multipart = require('connect-multiparty');
const SongController = require('../controllers/song-controller');
const md_auth = require('../middlewares/authenticated');

var md_upload = multipart({ uploadDir: './uploads/songs' });

const route = express.Router();

route.post('/register-song', md_auth.ensureAuth, SongController.saveSong);
route.get('/song/:id', md_auth.ensureAuth, SongController.getSong); 
route.get('/get-songs/:album?', md_auth.ensureAuth, SongController.getSongs); 
route.put('/update-songs/:id', md_auth.ensureAuth, SongController.updateSong); 
route.delete('/delete-song/:id', md_auth.ensureAuth, SongController.deleteSong);
route.post('/upload-file-song/:id', [md_auth.ensureAuth, md_upload], SongController.uploadSongFile);
route.get('/get-file-song/:song_file',  SongController.getSongFile);


module.exports = route;