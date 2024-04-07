const express = require('express');
const app = express();
const cors = require('cors');
const usersRouter = require('./router/user');
// 注册全局中间件
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

// 使用用户路由模块
app.use('/users', usersRouter);

// 启动服务器
app.listen(3007, '0.0.0.0',function () {
  console.log('api server running at http://127.0.0.1:3007');
});
