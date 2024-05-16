module.exports = {
	/**
	 *  设置服务器端口号
	 */
	networkIp: 'http://192.168.31.120',
	/**
	 *  设置 token 加密的密钥
	 */
	jwtSecretKey: 'itheimaNo1.^_^',
	/**
	 *  设置 token 的有效时间
	 */
	expiration_time: '10h',
	/**
	 *  设置服务器端口号
	 */
	port: 3007,
	/**
	 *  是否检验token
	 */
	is_verify: true,
	/**
	 *  通用密码
	 */
	password: 'xz123456',
};
/**
 *  使用第三方的中间件验证表单数据  https://joi.dev/api/?v=17.13.0
 */
