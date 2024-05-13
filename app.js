const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const {verifytoken,handleNotFound} = require('./common');
const usersRouter = require('./router/auth/login');
const userinfoRouter = require('./router/system/userinfo');
const fileRouter = require('./router/upload/file');
// 注册全局中间件
app.use(express.static(path.join(__dirname, 'public')));
// 跨域
app.use(cors());
// multipart/form-data
app.use(multer().any());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// 处理404
app.use(handleNotFound);
// 验证token
app.use(verifytoken());
// 使用用户路由模块
app.use('/auth', usersRouter);
app.use('/file', fileRouter);
app.use('/system', userinfoRouter);
app.use(function (err, req, res, next) {
	res.status(500).json({
		code: 1,
		data: err.message,
		message: '系统错误',
	});
});

// 启动服务器
app.listen(3007, '0.0.0.0', function () {
	console.log('api server running at http://127.0.0.1:3007');
});
