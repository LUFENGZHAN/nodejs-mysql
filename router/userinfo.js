// 用户信息的路由模块
// 导入 express
const express = require('express')
const router = express.Router()
 
// 导入用户信息的处理函数模块
const userinfo_handler = require('../router_handler/userinfo')
 
// 导入验证数据合法性的中间件
const expressJoi = require('@escook/express-joi')
 
// 导入解析 formdata 格式表单数据的包
const multer = require("multer")
 
// 导入处理路径的核心模块
const path = require('path')
 
// 导入需要的验证规则对象
const { update_userinfo_schema, update_password_schema } = require('../schema/user')
 
// 获取用户的基本信息
router.get('/userinfo', userinfo_handler.getUserInfo)
 
// 更新用户的基本信息
router.put('/userinfo', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo)
 
// 重置密码的路由
router.patch('/updatepwd', expressJoi(update_password_schema), userinfo_handler.updatePassword)
 
// 更新用户头像的路由 
// 注意：使用 express.urlencoded() 中间件无法解析 multipart/form-data 格式的请求体数据。
// npm i multer@1.4.2
 
// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, '../public/image/head_portrait') })
// upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
// 将文件类型的数据(avatar)，解析并挂载到 req.files 属性中 files是数组
// 将其他文本类型的数据，解析并挂载到 req.body 属性中
// array 有两个参数 表单name属性值(前端的文件对象名要和这里的相同) 最多上传文件的个数
router.post('/update/avatar', upload.array('avatar', 1), userinfo_handler.updateAvatar)
// 或
// 将文件类型的数据，解析并挂载到 req.file 属性中 file是对象
// 将其他文本类型的数据，解析并挂载到 req.body 属性中
// router.post('/update/avatar', upload.single('avatar'), userinfo_handler.updateAvatar)
 
module.exports = router
 