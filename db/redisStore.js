const { RedisStore } = require('connect-redis');
const { createClient } = require('redis');
const config = require('../config'); // 引入配置文件
const {formatDate} = require('../utils/index');
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

/**
 * 定时刷新在线状态 TTL
 */
const putOnlineUser = async (req, bool) => {
    if (req.session?.user) {
        const onlineKey = `online_user:${req.session.user.id}`;
        const exists = await redisClient.exists(onlineKey);
        if (!exists) {
            await redisClient.set(onlineKey, JSON.stringify(req.session.user), {
                EX: config.ONLINE_TTL
            });
        } else {
            await redisClient.expire(onlineKey, config.ONLINE_TTL);
        }
    }
    if (bool) {
        // 查询所有在线用户的 session
        const keys = await redisClient.keys('online_user:*');

        const sessions = await Promise.all(keys.map(key => redisClient.get(key)));
        const users = sessions
            .map(s => {
                try {
                    const session = JSON.parse(s);
                    return {
                        ...session, loginTime: formatDate(session.loginTime)
                    };
                } catch {
                    return null;
                }
            })
            .filter(u => u); // 过滤掉无法解析的 session
        return users;
    }
}
module.exports = {
    redisStore,
    redisClient,
    putOnlineUser
};
