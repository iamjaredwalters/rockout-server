const config = {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3001, // env vars are strings to begin with
    db: 'mongodb://primary:<password>@<url>',
    sessionSecret: 'some session key',
    spotify: {
        clientKey: '1234',
        clientSecret: '1234',
    },
};

export default config;
