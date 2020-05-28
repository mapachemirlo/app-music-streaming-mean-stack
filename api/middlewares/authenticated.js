'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const jwt_token = require('jsonwebtoken');


const ensureAuth = (req, res, next) => {
    try {
        if(!req.headers.authorization){
            return res.status(403).send({ status: 'ERROR', message: 'La peticion no tiene la cabecera de autenticación' });
        }
        const token = req.headers.authorization.replace(/['"]+/g, '');
        try {
            var payload = jwt.decode(token, process.env.JWT_SECRET);  

            if(payload.exp <= moment().unix()){  
                return res.status(401).send({ status: 'ERROR', message: 'EXPIRED_TOKEN' });
            }
        } catch (e) {
            console.log('Error al decodificar token: ', e);
            return res.status(404).send({ status: 'ERROR', message: 'INVALID_TOKEN' });
        }

        req.user = payload;
        next(); 
    } catch (e) {
        console.log('Error middleware ensureAuth', e);
    }
};

const ensureAuthByUser = (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if(authorization){
            const data = jwt_token.verify(authorization, process.env.JWT_SECRET);
            console.log('jwt data', data);
            req.sessionData = { userId: data.userId, role: data.role }; 
            next();
        }else{
            throw {
                code: 403,
                status: 'ACCESS_DENIED',
                message: 'Missing header token'
            }
        }
    } catch (e) {
        res.status(e.code || 500).send({ status: 'ACCESS_DENIED', message: 'Missing header token' });
    }
};


module.exports = {
    ensureAuth,
    ensureAuthByUser
};
