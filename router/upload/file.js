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

module.exports = router;
