const express = require('express')
const router = express.Router()
const expressJoi = require('../verify')

// 导入用户路由处理函数模块
const userHandler = require('../../router_handler/auth/login')
// 2. 导入需要的验证规则对象
const { reg_login_schema,update_password_schema } = require('../../schema/auth/user')

// 登录
router.post('/login', expressJoi(reg_login_schema), userHandler.login)

// 更新用户密码
router.post('/updatepwd', expressJoi(update_password_schema), userHandler.updatePassword)

// 将路由对象共享出去
module.exports = router
