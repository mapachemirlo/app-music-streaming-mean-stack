'use strict'

const path = require('path');
const fs = require('fs');
const mongoosePagination = require('mongoose-pagination');
const Artist = require('../models/artist-model');
const Album = require('../models/album-model');
const Song = require('../models/song-model');

const saveAlbum = (req, res) => {
    try {
        const album = new Album();

        const params = req.body;
    
        album.title = params.title;
        album.description = params.description;
        album.year = params.year;
        album.image = 'null';
        album.artist = params.artist;
    
        album.save((err, albumStored) => {
            if(err){
                res.status(500).send({ status: 'ERROR', message: 'SERVER ERROR EN LA PETICION' });
            }else{
                if(!albumStored){
                    res.status(404).send({ status: 'ERROR', message: 'NO SE HA PODIDO GUARDAR EL ALBUM' });
                }else{
                    res.status(200).send({ status: 'Ok', album: albumStored });
                }
            }
        });
    } catch (e) {
        res.status(500).send({ status: 'ERROR', message: e.message });
    }
};

const getAlbum = (req, res) => {
    try {
        const albumId = req.params.id;
        Album.findById(albumId).populate({ path: 'artist'}).exec((err, album) => {
            if(err){
                res.status(500).send({ status: 'ERROR', message: 'ERROR EN LA PETICION ALBUM' });
            }else{
                if(!album){
                    res.status(404).send({ status: 'ERROR', message: 'NO EXISTE EL ALBUM' });
                }else{
                    res.status(200).send({ status: 'Ok', album:album });
                }
            }
        });
    } catch (e) {
        res.status(500).send({ status: 'ERROR', message: e.message });
    }
};

const getAlbums = (req, res) => {
    try {
        const artistId = req.params.artist;

        if(!artistId){
            var find_album = Album.find({}).sort('title'); 
        }else{
            var find_album = Album.find({ artist: artistId }).sort('year');  
        }
        find_album.populate({ path: 'artist' }).exec((err, albums) => {
            if(err){
                res.status(500).send({ status: 'ERROR',  message: 'ERROR EN LA PETICION '});
            }else{
                if(!albums){
                    res.status(404).send({ status: 'ERROR',  message: 'NO SE ENCONTRARON ALBUMS '});
                }else{
                    res.status(200).send({ status: 'Ok',  albums: albums });
                }
            }
        });
    } catch (e) {
        res.status(500).send({ status: 'ERROR',  message: e.message });
    }
};

const updateAlbum = (req, res) => {
    try {
        const albumId = req.params.id;
        const update = req.body;
    
        Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
            if (err) {
                res.status(500).send({ status: 'ERROR', message: 'ERROR EN LA PETICION' });
            } else {
                if (!albumUpdated) {
                    res.status(404).send({ status: 'ERROR', message: 'NO SE PUDO ACCEDER AL ALBUM' });
                } else {
                    res.status(200).send({ status: 'Ok', album: albumUpdated });
                }
            }
        });
    } catch (e) {
        res.status(500).send({ status: 'ERROR', message: e.message });
    }
};

const deleteAlbum = (req, res) => {
    try {
        const albumId = req.params.id;

        Album.findByIdAndRemove( albumId, (err, albumRemove) => {
            if(err){
                res.status(500).send({ status: 'ERROR', message: 'ERROR EN ELIMNAR ALBUM' });
            }else{
                if(!albumRemove){
                    res.status(404).send({ status: 'ERROR', message: 'ALBUM NO HA SIDO ELIMINADO'});
                }else{  
                    Song.find({ album: albumRemove._id }).remove((err, songRemove) => {
                        if(err){
                            res.status(500).send({ status: 'ERROR', message: 'ERROR EN ELIMNAR CANCIÓN' });
                        }else{
                            if(!songRemove){
                                res.status(404).send({ status: 'ERROR', message: 'CANCION NO HA SIDO ELIMINADO'});
                            }else{
                                res.status(200).send({ album: albumRemove });
                            }
                        }
                    });
                }
            }
        });
    } catch (e) {
        res.status(500).send({ status: 'ERROR', message: e.message });
    }
};

const uploadImage = (req, res) => {
    try {
        const albumId = req.params.id;
        var file_name = 'Imagen No subida';  
    
        if(req.files){                            
            const file_path = req.files.image.path;  
            console.log('El path del archivo es: ', file_path);
    
            const file_split = file_path.split('\\');
            var file_name = file_split[2];
            console.log(file_name);
    
            const ext_split = file_name.split('\.');
            const file_ext = ext_split[1];
            console.log(file_ext);
    
            if(file_ext === 'png' || file_ext === 'jpg' || file_ext === 'gif'){
    
                Album.findByIdAndUpdate(albumId, { image: file_name }, (err, albumUpdated) => {
                    if(err){
                        res.status(500).send({ status: 'ERROR', message: 'ERROR_EN_LA_PETICION' });
                    }else{
                        if(!albumUpdated){
                            res.status(404).send({ status: 'ERROR', message: 'NOT_ALBUM_UPDATED' });
                        }else{
                            res.status(200).send({ status: 'OK', album: albumUpdated });
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

const getImageFile = (req, res) => {
    try {
        const imageFile = req.params.imageFile;
        const path_file = './uploads/albums/' + imageFile;
    
        fs.exists(path_file, (exists) => {
            if(exists){
                res.sendFile(path.resolve(path_file));
            }else{
                res.status(200).send({ message: 'NO EXISTE LA IMAGEN' });
            }
        });
    } catch (e) {
        res.status(404).send({ message: 'ERROR AL ACCDEDER A IMAGEN' });
    }
};


module.exports = {
    saveAlbum,
    getAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
};