import express from 'express';
import cors from 'cors'
// 创建 Express 应用程序
const app = express();
const PORT = 3000;
app.use(cors());
// 中间件解析请求体
app.use(express.json());

// 定义接口路由
app.get('/', (req, res) => {
  res.send('Welcome to my API!');
});

// 定义示例接口路由
app.get('/api/users', (req, res) => {
  const users = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
  ];
  res.json(users);
});

// 定义另一个示例接口路由
app.post('/api/users', (req, res) => {
  const { name } = req.body;
  const newUser = { id: 3, name }; // 简单起见，将新用户的ID设置为3
  res.status(201).json(newUser);
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});