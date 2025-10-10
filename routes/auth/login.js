const express = require('express')
const router = express.Router()
const expressjoi = require('@escook/express-joi')
// 导入用户路由处理函数模块
const userHandler = require('../../router_handler/auth/login')
// 2. 导入需要的验证规则对象
const { reg_login_schema, update_password_schema } = require('../../schema/auth/user')

// 登录
router.post('/login', expressjoi(reg_login_schema), userHandler.login)


// 更新用户密码
router.post('/updatepwd', expressjoi(update_password_schema), userHandler.updatePassword)

router.post('/logout', userHandler.logout)
router.get('/profile', userHandler.profile)
// 将路由对象共享出去
module.exports = router
