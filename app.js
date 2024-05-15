const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { verifytoken } = require('./common');
const usersRouter = require('./router/auth/login');
const userinfoRouter = require('./router/system/userinfo');
const fileRouter = require('./router/upload/file');
const config = require('./config');

// 静态资源
app.use(express.static(path.join(__dirname, 'public')));
// 跨域
app.use(cors());
// multipart/form-data
app.use(multer().any());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// 使用用户路由模块
app.use('/auth', verifytoken(config.is_verify), usersRouter);
app.use('/file', verifytoken(config.is_verify), fileRouter);
app.use('/system', verifytoken(config.is_verify), userinfoRouter);
app.use(function (err, req, res, next) {
	res.status(500).json({
		code: 1,
		data: err.message,
		message: '系统错误',
	});
});
// 启动服务器
app.listen(config.port, '0.0.0.0', function () {
	console.log(`api server running at http://127.0.0.1:${config.port}`);
});
