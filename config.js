module.exports = {
    /**
     *  设置服务器的ip地址
     */
    networkIp: 'http://127.0.0.1',
    /**
     * 设置 JWT 的加密和解密密钥
     */
    jwtSecretKey: 'c6f8a0d1b7c247c9e6d92b349e1c8b58c47a1ab5f6a36fffbf4b39b7459ce61a',
    /**
     * 设置 session 加密的密钥
     */
    sessionSecret: 'c5f8a0d1b7c247c9e6d92b349e1c8b58a47a13b5f6a36fffbf4b39b7459ce61d',
    /**
     * 设置 redis 地址
     */
    sessionHost: '127.0.0.1',
    /**
     *  设置 redis 端口号
     */
    sessionPort: 6379,
    /**
     *  设置服务器端口号
     */
    port: 3007,
    /**
     *  是否检验token
     */
    checkToken: ['/login'],
    /**
     *  通用密码
     */
    password: 'xiaozhan123456@',
};
/**
 *  使用第三方的中间件验证表单数据  https://joi.dev/api/?v=17.13.0
 */
