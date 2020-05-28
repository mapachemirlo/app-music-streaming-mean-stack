'use strict'

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../models/user-model');
const jwt = require('../service/jwt');
//const jwt = require('jsonwebtoken');

const expiresIn = 60 * 30;

function pruebas(req, res){
    res.status(200).send({ message: 'Probando controlador de usuario' });
};


const loginUser = async (req, res) => {
    try {
        const params = req.body;

        const email = params.email;
        const password = params.password;
    
        await User.findOne({ email: email.toLowerCase()}, (err, user) => {
            if(err){
                res.status(500).send({ status: 'ERROR', message: 'REQUEST_ERROR' });
            }else{
                if(!user){
                    res.status(404).send({ status: 'ERROR', message: 'USER_NOT_FOUND'});
                }else{
                    bcrypt.compare(password, user.password, (err, check) => {     
                        if(check){
                            if(params.gethash){
                                console.log(user);
                                res.status(200).send({ token: jwt.createToken(user) });
                            }else{
                                res.status(200).send({ user });
                            }
                        }else{
                            res.status(404).send({ status: 'ERROR', message: 'LOGIN_FAILED'});
                        }
                    });
                }
            }
        });    
    } catch (e) {
        res.status(500).send({ status: 'ERROR', message: e.message });
    }
};

const saveUser = async (req, res) => {
    try {
        const user = new User();
        const params = req.body;

        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.image = params.image;
        user.role = 'ROLE_USER';
        
        if(params.password){
            const hash = await bcrypt.hash(params.password, 15)
            user.password = hash;

            if(params.name && params.surname && params.email){
                if(user.name != null && user.surname != null && user.email != null){
                    await user.save((err, userStored) => {
                        if(err){
                            if(err.code && err.code === 11000){
                                console.log(err);
                                res.status(400).send({ status: 'DUPLICATE_VALUES', message: err.keyValue });
                            }
                        }else{
                            if(!userStored){
                                res.status(404).send({ status: 'ERROR', message: 'User has not registered' });
                            }else{
                                console.log(userStored);
                                res.status(200).send({ status: 'Ok', user: userStored, message: 'User created' });
                            }
                        }
                    });
                }else{
                    res.status(200).send({ status: 'ERROR', message: 'INCOMPLETE_DATA_PARAMS' });
                } 
            }else{
                res.status(200).send({ status: 'ERROR', message: 'INCOMPLETE_DATA' });
            }
            
        }else{
            res.status(500).send({ status: 'ERROR',  message: 'ENTER_A_PASSWORD' });
        }
    } catch (error) {
        console.log('Error create user', error);
        res.status(500).send({ status: 'ERROR', message: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;  
        const update = req.body;

        if(userId != req.user.sub){
           return res.status(500).send({ status: 'ERROR', message: 'ACCESS_DENIED_INVALID_TOKEN_TO_UPDATE_USER' });
        }
    
        await User.findByIdAndUpdate(userId, update, (err, userUpdate) => {
            if(err){
                res.status(500).send({ status: 'ERROR', message: 'ERROR_USER_UPDATED' });
            }else{
                if(!userUpdate){
                    res.status(404).send({ status: 'ERROR', message: 'NOT_USER_UPDATED' });
                }else{
                    res.status(200).send({ status: 'OK', user: userUpdate });
                }
            }
        });
    } catch (error) {
        if(error.code && error.code === 11000){
            res.status(400).send({ status: 'DUPLICATED_VALUES', message: error.keyValue });
            return;
        }
        res.status(500).send({ status: 'ERROR', message: 'SERVER_ERROR_USER_UPDATE' });
    }
};

const uploadImage = async (req, res) => {
    try {
        const userId = req.params.id;
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
    
                await User.findByIdAndUpdate(userId, { image: file_name }, (err, userUpdated) => {
                    if(err){
                        res.status(500).send({ status: 'ERROR', message: 'ERROR_USER_UPDATED' });
                    }else{
                        if(!userUpdated){
                            res.status(404).send({ status: 'ERROR', message: 'NOT_USER_UPDATED' });
                        }else{
                            res.status(200).send({ image: file_name, user: userUpdated });
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
        const path_file = './uploads/users/' + imageFile;
    
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
    pruebas,
    loginUser,
    saveUser,
    updateUser,
    uploadImage,
    getImageFile
};
