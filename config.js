module.exports = {
    /**
     * 服务器配置
     */
    networkIp: 'http://127.0.0.1',
    port: 3007,

    /**
     * JWT 和 session 配置
     */
    jwtSecretKey: 'c6f8a0d1b7c247c9e6d92b349e1c8b58c47a1ab5f6a36fffbf4b39b7459ce61a',
    sessionSecret: 'c5f8a0d1b7c247c9e6d92b349e1c8b58a47a13b5f6a36fffbf4b39b7459ce61d',

    /**
     * Redis 配置
     */
    sessionHost: '127.0.0.1',
    sessionPort: 6379,

    /**
     * 其他配置
     */
    ONLINE_TTL: 30,
    checkToken: ['/login'],
    password: 'xiaozhan123456@',

    /**
     * 统一接口前缀
     */
    apiPrefix: '/api/v1',
};
