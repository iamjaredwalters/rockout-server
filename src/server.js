import 'babel-polyfill';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import methodOverride from 'method-override';
import passport from 'passport';
import MongoClient from 'mongodb';

import './auth/passport';

import config from './config'; // config handles env configs

const app = express();


MongoClient.connect(config.db, (err, db) => {
    console.log('Mongodb ready.  Starting server...');

    if (err) throw err;

    app.set('port', (config.port));

    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(cors());
    app.use(methodOverride());
    app.use(session({
        secret: `${config.sessionSecret}`,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true },
    }));
    // Initialize Passport!  Also use passport.session() middleware, to support
    // persistent login sessions (recommended).
    app.use(passport.initialize());
    app.use(passport.session());

    // Express only serves static assets in production
    if (process.env.NODE_ENV === 'production') {
        app.use(express.static('client/build'));
    }

    app.get('/test', (err, res) => {
        console.log('test reached');
        // res.status(201).send('success!');
        // res.sendFile(__dirname + '/views/login.html');
    });

    app.get('/redirect', (err, res) => {
        console.log('redir reached');
    });

    app.get('/login', (err, res) => {
        console.log('login');
    });

    // GET /auth/spotify
    // Use passport.authenticate() as route middleware to authenticate the
    // request. The first step in spotify authentication will involve redirecting
    // the user to spotify.com. After authorization, spotify will redirect the user
    // back to this application at /auth/spotify/callback
    app.get('/auth/spotify',
        passport.authenticate('spotify', {
            scope: ['user-read-email', 'user-read-private'],
            showDialog: true,
        }),
        (req, res) => {
            // The request will be redirected to spotify for authentication, so this
            // function will not be called.
        });

    // // GET /auth/spotify/callback
    // //   Use passport.authenticate() as route middleware to authenticate the
    // //   request. If authentication fails, the user will be redirected back to the
    // //   login page. Otherwise, the primary route function function will be called,
    // //   which, in this example, will redirect the user to the home page.
    app.get('/auth/spotify/callback',
        passport.authenticate('spotify', { failureRedirect: '/login' }),
        (req, res) => {
            console.log('Auth Success!');
            res.redirect('/');
        });
    //
    // app.get('/logout', function(req, res){
    //     req.logout();
    //     res.redirect('/');
    // });

    app.listen(app.get('port'), () => {
        console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
    });

    // Simple route middleware to ensure user is authenticated.
    //   Use this route middleware on any resource that needs to be protected.  If
    //   the request is authenticated (typically via a persistent login session),
    //   the request will proceed. Otherwise, the user will be redirected to the
    //   login page.
    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login');
    }
});
