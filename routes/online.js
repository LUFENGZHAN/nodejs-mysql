// routes/online.js
const express = require('express');
const router = express.Router();
const { verifytoken } = require('../common')

// 假设 redisStore 是你 session store 对象
const { redisStore } = require('../db/redisStore'); // 替换成你的 redisStore 引入方式
const redisClient = redisStore.client;

// 获取在线用户数量
router.get('/count', async (req, res) => {
    try {
        const keys = await redisClient.keys('sess:*');
        res.json({ code: 0, data: { count: keys.length } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ code: 1, msg: '查询失败', error: err });
    }
});

// 获取在线用户列表
router.get('/list', async (req, res) => {
    try {
        const keys = await redisClient.keys('sess:*');
        const sessions = await Promise.all(keys.map(key => redisClient.get(key)));
        const users = sessions
            .map(s => {
                try {
                    const session = JSON.parse(s);
                    return session.user; // 假设登录时存了 req.session.user
                } catch {
                    return null;
                }
            })
            .filter(u => u); // 过滤掉空值
        res.json({ code: 0, data: { users, count: users.length } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ code: 1, msg: '查询失败', error: err });
    }
});

module.exports = router;
