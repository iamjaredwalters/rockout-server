console.log(process.env.PORT)
const config = {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3001, // env vars are strings to begin with
};

export default config;
