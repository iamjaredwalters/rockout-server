import 'babel-polyfill';
import express from 'express';
import config from './config'; // config handles env configs

const app = express();

app.set('port', (config.port));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

app.listen(app.get('port'), () => {
    console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
