const redisStore = require("cache-manager-redis-store");

export default {
  ttl: 300,
  store: redisStore,
  ...(process.env.REDIS_URL
    ? {
        url: process.env.REDIS_URL
      }
    : {
        host: "localhost",
        port: 6379,
        db: 0
      })
};
