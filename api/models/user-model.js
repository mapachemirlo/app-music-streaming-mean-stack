'use strict'

const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, require: true },
    role: { type: String, enum: ['ROLE_ADMIN', 'ROLE_USER'], default: 'ROLE_USER' }
    
});

module.exports = mongoose.model('User', UserSchema); 