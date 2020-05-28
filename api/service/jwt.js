'use strict'

const jwttoken = require('jsonwebtoken');
const jwt = require('jwt-simple');
const moment = require('moment');

const createToken = (user) => {     
    try {
        const payload = {
            sub: user._id,          
            name: user.name,
            surname: user.surname,
            email: user.email,
            role: user.role,
            image: user.image,
            iat: moment().unix(),   
            exp: moment().add(30, 'days').unix()
        };
        return jwt.encode(payload, process.env.JWT_SECRET);
    } catch (error) {
        console.log('ERROR al generar token: ', error);
    }
};

module.exports = { createToken };