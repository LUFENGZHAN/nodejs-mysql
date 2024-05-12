const express = require('express')
// 创建路由对象
const router = express.Router()
// 导入解析 formdata 格式表单数据的包
const multer = require('multer')
// 导入处理路径的核心模块
const path = require('path')


// 调用保存文件的函数
// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, '../../public/images') })
router.post('/upload', upload.single('file'), (req, res) => {
    // 获取表单中提交的数据
    console.log(req.file)
    console.log(req.body)
    // 获取上传的文件的信息
    // console.log(req.file)
    // 获取上传的文件的后缀名
    res.json({
        status: '0',
        message: '文件上传成功',
        // 获取上传的文件名
        // file: req.file.filename
        // url: req.file.originalname
    })
    try {
        
    } catch (error) {
        res.json({
            status: '1',
            data: error,
            message: '文件上传失败'
        })
    }
})
// upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
// 将文件类型的数据(avatar)，解析并挂载到 req.files 属性中 files是数组
// 将其他文本类型的数据，解析并挂载到 req.body 属性中
// array 有两个参数 表单name属性值(前端的文件对象名要和这里的相同) 最多上传文件的个数
// 或
// 将文件类型的数据，解析并挂载到 req.file 属性中 file是对象
// 将其他文本类型的数据，解析并挂载到 req.body 属性中
// router.post('/update/avatar', upload.single('avatar'), userinfo_handler.updateAvatar)
module.exports = router