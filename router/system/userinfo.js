// 用户信息的路由模块、
const express = require('express')
const router = express.Router()
// 导入验证数据合法性的中间件
const expressJoi = require('../verify')
// 导入用户信息的处理函数模块
const userinfo_handler = require('../../router_handler/system/userinfo')
// 导入需要的验证规则对象
const { update_userinfo_schema } = require('../../schema/system/system')

// 获取用户的基本信息
router.get('/user/userinfo/get', expressJoi(),userinfo_handler.getUserInfo)

// 更新用户的基本信息
router.put('/user/userinfo/update', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo)

module.exports = router
