'use strict'

const mongoose = require('mongoose');
const { Schema } = mongoose;

const SongSchema = Schema({
    name: { type: String },
    number: { type: String },
    duration: { type: String },
    file: { type: String },
    album: { type: Schema.ObjectId, ref: 'Album' }
});

module.exports = mongoose.model('Song', SongSchema); 