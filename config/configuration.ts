export default {
    port: parseInt(process.env.PORT) || 3000,
    dbURI: process.env.MONGODB_URI,
};