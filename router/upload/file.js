const express = require('express'); // 引入express模块
const router = express.Router(); // 创建路由对象
const { v4: uuidv4 } = require('uuid');
const joi = require('joi'); // 引入joi模块
const fs = require('fs'); // 引入文件操作模块
const path = require('path'); // 引入路径模块
const config = require('../../config'); // 引入配置文件
const expressjoi = require('@escook/express-joi'); // 引入处理路径的模块
const verifyVlaue = {
	body: {
		type: joi.string().required(),
	},
};
// 文件上传
router.post('/upload', expressjoi(verifyVlaue), (req, res) => {
	if (req.files.length === 0) {
		return res.json({
			code: 1,
			data: null,
			message: '没有上传文件',
		});
	}
	const filePath = path.join(__dirname, `../../public/${req.body.type}`);
	if (!fs.existsSync(filePath)) {
		fs.mkdirSync(filePath);
	}
	const url = `${config.networkIp}:${config.port}/${req.body.type}/`;
	const files = req.files.map(item => {
		const writePath = path.join(filePath, item.originalname);
		fs.writeFileSync(writePath, item.buffer);
		return {
			id: uuidv4(),
			originalname: item.originalname,
			mimetype: item.mimetype,
			url: url  + item.originalname,
		};
	});
	console.log(files);
	const responseData = {
		code: 0,
		message: '上传成功',
	};
	if (files.length === 1) {
		responseData.data = files[0];
	} else {
		responseData.data = files;
	}
	res.json(responseData);
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
