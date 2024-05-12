const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const config = require('./config');
const CryptoJS = require('crypto-js');
const cors = require('cors');
const path = require('path');
const usersRouter = require('./router/auth/login');
const userinfoRouter = require('./router/system/userinfo');
const fileRouter = require('./router/upload/file');
// 注册全局中间件
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
// multipart/form-data
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use((req, res, next) => {
	if (req.method === 'POST' && req.body.p_data) {
		try {
			req.body = JSON.parse(CryptoJS.AES.decrypt(req.body.p_data, config.jwtSecretKey).toString(CryptoJS.enc.Utf8));
		} catch (error) {
			console.log(error);
		}
	}
	next();
});
// 使用用户路由模块
app.use('/auth', usersRouter);
app.use('/file', fileRouter);
app.use('/system', userinfoRouter);
app.use(function (err, req, res, next) {
	res.json({
		code: 1,
        data: err.message,
		message: err.message,
	})
})
// 启动服务器
app.listen(3007, '0.0.0.0', function () {
	console.log('api server running at http://127.0.0.1:3007');
});
