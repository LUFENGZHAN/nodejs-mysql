const jwt = require('jsonwebtoken');
const config = require('./config');
const CryptoJS = require('crypto-js');
exports.verifytoken = function (is_verify) {
	return (req, res, next) => {
		try {
            if (!is_verify) return next();
			if (config.exemption.includes(req.path)) {
				return next();
			}
			// 从请求头中获取 token
			const token = req.headers['authorization'];
			// 检查 token 是否存在
			if (!token) {
				return res.status(401).json({ code: 401, error: '信息认证失败' });
			}
			// 解码请求体中的数据
			if (req.method === 'POST' && req.body && req.body.p_data) {
				req.body = JSON.parse(CryptoJS.AES.decrypt(req.body.p_data, config.jwtSecretKey).toString(CryptoJS.enc.Utf8));
			}
			// 验证 token
			jwt.verify(token, config.jwtSecretKey, (err, decoded) => {
				if (err) {
					return res.status(401).json({ code: 401, data: err, error: '无效的信息' });
				}
				// token 验证通过，将解码后的用户信息存储在请求对象中
				req.user = decoded;
				next(); // 继续执行下一个中间件或路由处理程序
			});
		} catch (error) {
			console.log(error);
		}
	};
};
