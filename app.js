const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { verifytoken } = require('./common');
const config = require('./config');
const session = require('express-session');
const { redisStore } = require('./db/redisStore');

const usersRouter = require('./routes/auth/login');
const userinfoRouter = require('./routes/system/userinfo');
const fileRouter = require('./routes/upload/file');
const onlineRouter = require('./routes/online'); // 引入在线用户路由
// 静态资源
app.use(express.static(path.join(__dirname, 'public')));
// 跨域
app.use(cors({
    origin: 'http://localhost:1111',
    credentials: true
}));
// multipart/form-data
app.use(multer().any());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// 配置 session 中间件
app.use(
  session({
    store: redisStore,
    secret: config.sessionSecret, // 从配置中读取
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 12, // 1 天
      httpOnly: true,
    },
  })
);

// 使用用户路由模块
app.use('/online',verifytoken(), onlineRouter);
app.use('/auth', verifytoken(),usersRouter);
app.use('/file',verifytoken(), fileRouter);
app.use('/system', verifytoken(),userinfoRouter);
app.use(function (err, req, res, next) {
	res.status(500).json({
		code: 1,
		data: err.message,
		message: '服务器错误',
	});
});
process.env.NODE_ENV =1223

// 启动服务器
app.listen(config.port, '0.0.0.0', function () {
	console.log(`api server running at http://127.0.0.1:${config.port}`);
});
