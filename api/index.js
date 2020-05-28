'use strict'

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config();

const PORT = process.env.PORT || 5000;

mongoose.connect( process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to mongodb');
    app.listen(PORT, () => {
        console.log(`Running on ${PORT}`);
    });
}).catch(error => {
    console.log('mongodb error', error);
});

// mongoose.connect('mongodb://localhost:27017/curso_mean2', (err, res) => {
//     if(err){
//         throw err;
//     }else{
//         console.log("*** Mongodb connected in port: 27017 ***");
//         app.listen(PORT, () => {
//             console.log(`Server running in http://localhost:${PORT}`);
//         });
//     }
// });