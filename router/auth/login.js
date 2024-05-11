// 用户登录/注册的路由模块
const express = require('express')
// 创建路由对象
const router = express.Router()

// 导入用户路由处理函数模块
const userHandler = require('../../router_handler/auth/login')

// 1. 导入验证表单数据的中间件(自动验证) npm i @escook/express-joi
const expressJoi = require('@escook/express-joi')

// 2. 导入需要的验证规则对象
const { reg_login_schema } = require('../../schema/auth/login')

// 登录
router.post('/login', expressJoi(reg_login_schema), userHandler.login)
router.use(function (err, req, res, next) {
	res.json({
		code: 1,
        data: err.message,
		message: '登录失败!',
	})
})
// 将路由对象共享出去
module.exports = router