export default () => ({
    port: parseInt(process.env.PORT) || 3000,
    dbURI: process.env.MONGODB_URI,
    tokenSecret: process.env.TOKEN_SECRET,
    heroApiToken: process.env.HERO_API_TOKEN,
    suitItemsPerHero: parseInt(process.env.SUIT_ITEMS_PER_HERO) || 2,
    heroesPerTrainer: parseInt(process.env.HEROES_PER_TRAINER) || 3
});