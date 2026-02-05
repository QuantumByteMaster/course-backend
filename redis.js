const Redis = require("ioredis");
const redis = new Redis(); // Defaults to 127.0.0.1:6379

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

module.exports = redis;
