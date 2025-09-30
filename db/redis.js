const { createClient } = require('redis');
const config = require('../config');

const redisClient = createClient({
  url: 'redis://localhost:'+ config.port, // 修改为你的 Redis 地址
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
  await redisClient.connect();
})();

module.exports = { redisClient };
