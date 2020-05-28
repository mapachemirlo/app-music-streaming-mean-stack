'use strict'

const path = require('path');
const fs = require('fs');
const mongoosePagination = require('mongoose-pagination');
const Artist = require('../models/artist-model');
const Album = require('../models/album-model');
const Song = require('../models/song-model');


const saveArtist = (req, res) => {
    try {
        const artist = new Artist();

        const params = req.body;
        artist.name = params.name;
        artist.description = params.description;
        artist.image = 'null';
    
        artist.save((err, artistStored) => {
            if(err){
                res.status(500).send({ status: 'ERROR', message: 'ERROR AL GUARDAR ARTISTA' });
            }else{
                if(!artistStored){
                    res.status(404).send({ status: 'ERROR', message: 'ARTISTA NO PUEDO SER GUARDADO' });
                }else{
                    res.status(200).send({ status: 'Ok', artist: artistStored });
                }
            }
        });
    } catch (e) {
        res.status(500).send({ status: 'ERROR', message: e.message });
    }
};

const getArtist = async (req, res) => {
    try {
        const artistId = req.params.id;

        await Artist.findById(artistId, (err, artist) => {
            if(err){
                res.status(500).send({ status: 'ERROR', message: 'ERROR EN LA PETICION' });
            }else{
                if(!artist){
                    res.status(404).send({ status: 'ERROR', message: 'EL ARTISTA NO EXISTE' });
                }else{
                    res.status(200).send({ artist });
                }
            }
        });
    } catch (e) {
        res.status(500).send({ status: 'ERROR', message: e.message });
    }
};

const getArtists = async (req, res) => {
    try {

        if(req.params.page){
            var page = req.params.page;
        }else{
            var page = 1;
        }
        
        const itemsPerPage = 3;
    
        await Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total_items) => {
            if(err){
                res.status(500).send({ status: 'ERROR', message: 'ERROR EN LA PETICION' });
            }else{
                if(!artists){
                    res.status(404).send({ status: 'ERROR', message: 'NO HAY ARTISTAS' });
                }else{
                    return res.status(200).send({
                        total_items: total_items,
                        artists: artists
                    });
                }
            }
        });
    } catch (e) {
        res.status(500).send({ status: 'HORROR', message: e.message });
    }
}; 

const updateArtist = async (req, res) => {
    try {
        const artistId = req.params.id;
        const update = req.body;
    
        await Artist.findByIdAndUpdate(artistId, update, (err, artistUpdate) => {
            if(err){
                res.status(500).send({ status: 'ERROR', message: 'ERROR EN LA PETICION' });
            }else{
                if(!artistUpdate){
                    res.status(404).send({ status: 'ERROR', message: 'ERROR AL ACTUALIZAR ARTISTA' });
                }else{
                    res.status(200).send({ status: 'Ok', artist: artistUpdate });
                }
            }
        });
    } catch (e) {
        res.status(500).send({ status: 'ERROR', message: e.message });
    }
};

const deleteArtist =  (req, res) => {
    try {
        const artistId = req.params.id;

        Artist.findByIdAndRemove(artistId, (err, artistRemove) => {
            if(err){
                res.status(500).send({ status: 'ERROR', message: 'ERROR EN LA PETICION' });
            }else{
                if(!artistRemove){
                    res.status(404).send({ status: 'ERROR', message: 'ARTISTA NO HA SIDO ELIMINADO'});
                }else{
                    Album.find({ artist: artistRemove._id }).remove((err, albumRemove) => {
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
                                            res.status(200).send({ artist: artistRemove });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    } catch (e) {
        res.status(500).send({ status: 'ERROR', message: e.message});
    }
};

const uploadImage = async (req, res) => {
    try {
        const artistId = req.params.id;
        const file_name = 'Imagen No subida';  
    
        if(req.files){                            
            const file_path = req.files.image.path;  
            console.log('El path del archivo es: ', file_path);
    
            const file_split = file_path.split('\\');
            const file_name = file_split[2];
            console.log(file_name);
    
            const ext_split = file_name.split('\.');
            const file_ext = ext_split[1];
            console.log(file_ext);
    
            if(file_ext === 'png' || file_ext === 'jpg' || file_ext === 'gif'){
    
                await Artist.findByIdAndUpdate(artistId, { image: file_name }, (err, artistUpdate) => {
                    if(err){
                        res.status(500).send({ status: 'ERROR', message: 'ERROR_ARTIST_UPDATED' });
                    }else{
                        if(!artistUpdate){
                            res.status(404).send({ status: 'ERROR', message: 'NOT_ARTIST_UPDATED' });
                        }else{
                            res.status(200).send({ status: 'OK', message: 'ARTIST_UPDATED' });
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
        const path_file = './uploads/artists/' + imageFile;
    
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
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};
