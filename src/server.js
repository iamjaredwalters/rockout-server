import 'babel-polyfill';
import express from 'express';
import config from './config'; // config handles env configs
import MongoClient from 'mongodb';

const app = express();


MongoClient.connect('mongodb://primary:bleh1845@ds127391.mlab.com:27391/rock', (err, db) => {
    console.log('Mongo started');

    if (err) throw err;

    app.set('port', (config.port));

    // Express only serves static assets in production
    if (process.env.NODE_ENV === 'production') {
        app.use(express.static('client/build'));
    }

    app.listen(app.get('port'), () => {
        console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
    });
});
