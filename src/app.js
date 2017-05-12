import 'babel-polyfill';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import methodOverride from 'method-override';
import passport from 'passport';
import MongoClient from 'mongodb';
import connectMongoSession from 'connect-mongodb-session';
import './auth/passport';
import config from './config'; // config handles env configs

const app = express();

const MongoStore = connectMongoSession(session);

const store = new MongoStore(
    {
        uri: config.mongodb.db,
        collection: 'mySessions',
    },
    (error) => {
        console.log(`Error connecting MongoStore`, error);
    },
);

// Create Mongo Store for Spotify session management
store.on('error', (error) => {
    console.log(`MongoStore error: ${error}`);
});

// Setup app
app.set('port', (config.port));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());
app.use(methodOverride());
app.use(session({
    secret: `${config.sessionSecret}`,
    store: store,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
}));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

app.get('/login', (err, res) => {
    console.log('Failed. Redirected to login');
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

// GET /auth/spotify/callback
// Use passport.authenticate() as route middleware to authenticate the
// request. If authentication fails, the user will be redirected back to the
// login page. Otherwise, the primary route function function will be called,
// which, in this example, will redirect the user to the home page.
app.get('/auth/spotify/callback',
    passport.authenticate('spotify', { failureRedirect: '/login' }),
    (req, res) => {
        console.log('Auth Success! ');

        /**
         * Store User on success
         *
         * @TODO: User data should be parsed and stored rather than storing the entire user returned from API
         */
        MongoClient.connect(config.mongodb.db)
            .then((db) => {
                console.log('Successfully connected to Mongodb');
                db.collection('users').insertOne({ ...req.user._json })
                    .then((res) => {
                        console.log('User inserted successfully');
                    })
                    .catch((e) => {
                        console.log(`User unsuccessfully inserted: ${e}`);
                    });
            })
            .catch((e) => {
                console.log(`Error connecting to db: ${e}`);
            });

        res.json({
            type: 'SUCCESS',
            data: { ...req.user._json },
        });
    },
);

app.listen(app.get('port'), () => {
    console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
