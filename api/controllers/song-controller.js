'use strict'

const path = require('path');
const fs = require('fs');
const mongoosePagination = require('mongoose-pagination');

const Artist = require('../models/artist-model');
const Album = require('../models/album-model');
const Song = require('../models/song-model');


const saveSong = (req, res) => {
    try {
        const song = new Song();
        const params = req.body;
    
        song.name = params.name;
        song.number = params.number;
        song.duration = params.duration;
        song.file = null;
        song.album = params.album;
    
        song.save((err, songStored) => {
            if (err) {
                res.status(500).send({ status: 'ERROR', message: 'ERROR EN LA PETICION' });
            } else {
                if (!songStored) {
                    res.status(404).send({ status: 'ERROR', message: 'ERROR AL GUARDAR LA CANCIÓN' });
                } else {
                    res.status(200).send({ song: songStored });
                }
            }
        });    
    } catch (e) {
        res.status(500).send({ status: 'ERROR', message: e.message });
    }
};

const getSong = (req, res) => {
    try {
        const songId = req.params.id;

        Song.findById(songId).populate({ path: 'album' }).exec((err, song) => {
            if (err) {
                res.status(500).send({ status: 'ERROR', message: 'ERROR EN LA PETICION' });
            } else {
                if (!song) {
                     res.status(404).send({ status: 'ERROR', message: 'NO EXISTE LA CANCIÓN' });
                } else {
                     res.status(200).send({ song: song });
                }
            }
        });
    } catch (e) {
        res.status(500).send({ status: 'ERROR', message: e.message });
    }
};

const getSongs = (req, res) => {
    try {
        const albumId = req.params.album;

        if (!albumId) {
            var find_album = Song.find({}).sort('number');
        } else {
            var find_album = Song.find({ album: albumId }).sort('number');
        }
    
        find_album.populate({ 
            path: 'album',       
            populate: { 
                path: 'artist',  
                model: 'Artist'  
            }
        }).exec((err, songs) => {
            if (err) {
                res.status(500).send({ status: 'ERROR', message: 'ERROR EN LA PETICIÓN' });
            } else {
                if (!songs) {
                    res.status(404).send({ status: 'ERROR', message: 'NO SE ENCONTRARON CANCIONES' });
                } else {
                    res.status(200).send({ songs: songs });
                }
            }
        });
    } catch (e) {
        res.status(500).send({ status: 'ERROR', message: 'ERROR EN LA PETICIÓN' });
    }
};

const updateSong = (req, res) => {
    try {
        const songId = req.params.id;
        const update = req.body;
    
        Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
            if (err) {
                res.status(500).send({ status: 'ERROR', message: 'ERROR EN LA PETICION' });
            } else {
                if (!songUpdated) {
                    res.status(404).send({ status: 'ERROR', message: 'NO SE ENCONTRÓ LA CANCIÓN' });
                } else {
                    res.status(200).send({ song: songUpdated });
                }
            }
        });
    } catch (e) {
        res.status(500).send({ status: 'ERROR', message: e.message });
    }
};

const deleteSong = (req, res) => {
    try {
        const songId = req.params.id;
    
        Song.findByIdAndDelete(songId, (err, songDeleted) => {
            if (err) {
                res.status(500).send({ status: 'ERROR', message: 'ERROR EN LA PETICION' });
            } else {
                if (!songDeleted) {
                    res.status(404).send({ status: 'ERROR', message: 'NO SE ENCONTRÓ LA CANCIÓN A BORRAR' });
                } else {
                    res.status(200).send({ song: songDeleted });
                }
            }
        });
    } catch (e) {
        res.status(500).send({ status: 'ERROR', message: e.message });
    }
};

const uploadSongFile = (req, res) => {
    try {
        const songId = req.params.id;
        var file_name = 'Imagen No subida';  
    
        if(req.files){                           
            const file_path = req.files.file.path;  
            console.log('El path del archivo es: ', file_path);
    
            const file_split = file_path.split('\\');
            var file_name = file_split[2];
            console.log(file_name);
    
            const ext_split = file_name.split('\.');
            const file_ext = ext_split[1];
            console.log(file_ext);
    
            if(file_ext === 'mp3' || file_ext === 'ogg'){
    
                Song.findByIdAndUpdate(songId, { file: file_name }, (err, songUpdated) => {
                    if(err){
                        res.status(500).send({ status: 'ERROR', message: 'ERROR_EN_LA_PETICION' });
                    }else{
                        if(!songUpdated){
                            res.status(404).send({ status: 'ERROR', message: 'NOT_SONG_UPDATED' });
                        }else{
                            res.status(200).send({ song: songUpdated });
                        }
                    }
                });
    
            }else{
                res.status(200).send({ message: 'Extensión de archivo inválida, solo se admite png, jpg y gif' });
            }
        }else{
            res.status(200).send({ message: 'NO has subido ninguna imagenn' });
        }
    } catch (e) {
        res.status(200).send({ status: 'ERROR', message: 'NO has subido ninguna imagenn' });
        console.log('Error upload image: ', e.message );
    }
};

const getSongFile = (req, res) => {
    try {
        const song_file = req.params.song_file;
        const path_file = './uploads/songs/' + song_file;
    
        fs.exists(path_file, (exists) => {
            if(exists){
                res.sendFile(path.resolve(path_file));
            }else{
                res.status(200).send({ message: 'NO EXISTE LA CANCIÓN' });
            }
        });
    } catch (e) {
        res.status(404).send({ message: 'ERROR AL ACCDEDER A LA CANCIÓN' });
    }
};


module.exports = {
    saveSong,
    getSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadSongFile,
    getSongFile
}