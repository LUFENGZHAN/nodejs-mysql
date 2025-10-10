
const config = require('./config');
const CryptoJS = require('crypto-js');
exports.verifytoken = function () {
    return (req, res, next) => {
        try {
            // 解码请求体中的数据
            if (req.method === 'POST' && req.body && req.body.p_data) {
                req.body = JSON.parse(CryptoJS.AES.decrypt(req.body.p_data, config.jwtSecretKey).toString(CryptoJS.enc.Utf8));
            }
            if (config.checkToken.includes(req.path)) return next();
            // 从请求头中获取 token
            const token = req.headers['authorization'];
            // 检查 token 是否存在
            if (!token) {
                return res.status(401).json({ code: 401, error: '信息认证失败' });
            }
            // 判断 session 中是否存在用户信息
            if (req.session && req.session.user) {
                // 登录状态有效，将用户信息挂载到 req.user
                req.user = req.session.user;
                return next();
            }

            // 没有登录
            return res.status(401).json({
                code: 401,
                error: '未登录或登录已过期'
            });
        } catch (error) {
            console.log(error);
        }
    };
};
