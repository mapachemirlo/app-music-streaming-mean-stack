'use strict'

const express = require('express');
const UserController = require('../controllers/user-controller');
const md_auth = require('../middlewares/authenticated')
const multipart = require('connect-multiparty');    

var md_upload = multipart({ uploadDir: './uploads/users' }); 

const route = express.Router();

route.get('/prueba-controller', md_auth.ensureAuth, UserController.pruebas);
route.post('/register', UserController.saveUser);
route.post('/login', UserController.loginUser);
route.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);   
route.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
route.get('/get-image-user/:imageFile',  UserController.getImageFile);



module.exports = route;