import passport from 'passport';
import SpotifyStrategy from 'passport-spotify';
import config from '../config';


//  Passport session setup.
//  To support persistent login sessions, Passport needs to be able to
//  serialize users into and deserialize users out of the session. Typically,
//  this will be as simple as storing the user ID when serializing, and finding
//  the user by ID when deserializing. However, since this example does not
//  have a database of user records, the complete spotify profile is serialized
//  and deserialized.
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});


passport.use(new SpotifyStrategy.Strategy({
    clientID: config.spotify.clientKey,
    clientSecret: config.spotify.clientSecret,
    callbackURL: `http://localhost:${config.port}/auth/spotify/callback`,
},
    (accessToken, refreshToken, profile, done) => {
        console.log('User found!', profile);

        // asynchronous verification, for effect...
        process.nextTick(() => {
            // To keep the example simple, the user's spotify profile is returned to
            // represent the logged-in user. In a typical application, you would want
            // to associate the spotify account with a user record in your database,
            // and return that user instead.
            return done(null, profile);
        });
    }),
);
