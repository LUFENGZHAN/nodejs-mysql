const jwt = require('jsonwebtoken');
const Joi = require('joi');
const config = require('../config');
// 校验 token 的中间件函数
const expressJoi = function (schemas, options = { strict: false }) {
	// 自定义校验选项
	// strict 自定义属性，默认不开启严格模式，会过滤掉那些未定义的参数项
	//        如果用户指定了 strict 的值为 true，则开启严格模式，此时不会过滤掉那些未定义的参数项
	if (!options.strict) {
		// allowUnknown 允许提交未定义的参数项
		// stripUnknown 过滤掉那些未定义的参数项
		options = { allowUnknown: true, stripUnknown: true, ...options };
	}
	// 从 options 配置对象中，删除自定义的 strict 属性
	delete options.strict;

	// TODO: 用户指定了什么 schema，就应该校验什么样的数据
	return async function (req, res, next) {
		try {
			if (schemas) {
				['body', 'query', 'params'].forEach(key => {
					// 如果当前循环的这一项 schema 没有提供，则不执行对应的校验
					if (!schemas[key]) return;

					// 执行校验
					const schema = Joi.object(schemas[key]);
					const { error, value } = schema.validate(req[key], options);
					if (error) {
						// 校验失败
						throw error;
					} else {
						// 校验成功，把校验的结果重新赋值到 req 对应的 key 上
						req[key] = value;
					}
				});
			}
			if (['/login'].includes(req.path)) {
				return next();
			}
			// 从请求头中获取 token
			const token = req.headers['authorization'];
			// 检查 token 是否存在
			if (!token) {
				return res.status(401).json({ code: 401, error: '信息认证失败' });
			}
			// 验证 token
			jwt.verify(token, config.jwtSecretKey, (err, decoded) => {
				if (err) {
					return res.status(403).json({ code: 401, data: err, error: '无效的信息' });
				}
				// token 验证通过，将解码后的用户信息存储在请求对象中
				req.user = decoded;
				next(); // 继续执行下一个中间件或路由处理程序
			});
		} catch (error) {
			next(error);
		}
	};
};

module.exports = expressJoi;
