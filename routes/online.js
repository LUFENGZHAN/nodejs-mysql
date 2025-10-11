// routes/online.js
const express = require('express');
const router = express.Router();
const config = require('../config');
// 假设 redisStore 是你 session store 对象
const { redisStore, putOnlineUser } = require('../db/redisStore'); // 替换成你的 redisStore 引入方式
const redisClient = redisStore.client;

// 在线状态 TTL，单位秒
router.post('/heartbeat', async (req, res) => {
    return res.json({ code: 0, msg: '心跳保持成功' });
})

// 获取在线用户列表
router.get('/list', async (req, res) => {
    try {
        const users = await putOnlineUser(req, true); // 获取在线用户列表

        res.json({ code: 0, data:users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ code: 1, msg: '查询失败', error: err });
    }
});

module.exports = router;
