// 用户信息的路由模块、
const express = require('express')
const router = express.Router()
// 导入验证数据合法性的中间件
const expressjoi = require('@escook/express-joi')

// 导入用户信息的处理函数模块
const userinfo_handler = require('../../router_handler/system/users')
// 导入需要的验证规则对象
const { update_userinfo_schema } = require('../../schema/system/users')

// 获取用户的基本信息
router.get('/users/list',userinfo_handler.getUserInfo)

router.get('/users/get',userinfo_handler.getUserInfo)


router.put('/users/update', expressjoi(update_userinfo_schema), userinfo_handler.updateUserInfo)
router.post('/users/update', expressjoi(update_userinfo_schema), userinfo_handler.updateUserInfo)
router.delete('/users/update', expressjoi(update_userinfo_schema), userinfo_handler.updateUserInfo)
module.exports = router
