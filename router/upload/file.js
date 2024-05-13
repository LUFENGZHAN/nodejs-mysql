const express = require('express');
// 创建路由对象
const router = express.Router();
const joi = require('joi')
// 导入处理路径的核心模块
const path = require('path');
const expressjoi = require('@escook/express-joi');
const verifyVlaue = {
	body: {
		type:joi.string().required(),
	},
};
//文件上传
router.post('/upload', expressjoi(verifyVlaue), (req, res) => {

	if (req.files.length === 0) {
		return res.json({
			code: 1,
			data: null,
			message: '没有上传文件',
		});
	}
	const files = req.files;
	console.log(files);
	res.json({
		code: 0,
		data: {
			file: '123',
			url: '123',
		},
		message: '文件上传成功',
	});
	try {
	} catch (error) {
		res.json({
			code: 1,
			data: error,
			message: '文件上传失败',
		});
	}
});
// upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
// 将文件类型的数据(avatar)，解析并挂载到 req.files 属性中 files是数组
// 将其他文本类型的数据，解析并挂载到 req.body 属性中
// array 有两个参数 表单name属性值(前端的文件对象名要和这里的相同) 最多上传文件的个数
// 或
// 将文件类型的数据，解析并挂载到 req.file 属性中 file是对象
// 将其他文本类型的数据，解析并挂载到 req.body 属性中
// router.post('/update/avatar', upload.single('avatar'), userinfo_handler.updateAvatar)
module.exports = router;
