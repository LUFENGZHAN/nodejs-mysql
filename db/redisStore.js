const {RedisStore } = require('connect-redis');
const { createClient } = require('redis');
const config = require('../config'); // 引入配置文件
// 创建 Redis 客户端
const redisClient = createClient({
  legacyMode: true, // connect-redis 推荐开启 legacyMode
  socket: {
    host: config.sessionHost, // Redis 地址
    port: config.sessionPort // Redis 端口
  }
});

redisClient.connect().catch(console.error);

// 创建 RedisStore 实例
const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'sess:' // session 前缀
});

module.exports = {
  redisStore,
  redisClient
};
