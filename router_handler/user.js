/**
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */
// 导入 mySql 数据库的链接模块
const db = require('../db/index.js')

// 导入对密码进行加密处理的第三方中间件  npm i bcryptjs@2.4.3
const bcrypt = require('bcryptjs')

// 用这个包来生成 Token 字符串
const jwt = require('jsonwebtoken')

// 导入配置文件
const config = require('../config')

// 注册用户的处理函数
exports.regUser = (req, res) => {
	// 1.判断用户名和密码是否为空
	// 接收表单数据
	const userinfo = req.body
	// 2.检测用户名是否被占用
	// 定义 SQL 语句：
	const sql = `select * from users where username=?`
	// 执行 SQL 语句并根据结果判断用户名是否被占用：
	db.query(sql, [userinfo.username], function (err, results) {
		// 执行 SQL 语句失败
		if (err) {
			return res.send({
				status: 0,
				msg: err.message,
			})
		}
		// 用户名被占用
		if (results.length > 0) {
			return res.send({
				status: 0,
				msg: '用户名被占用，请更换其他用户名!',
			})
		}
		// TODO: 用户名可用，继续后续流程...
		// 调用 bcrypt.hashSync(明文密码, 随机盐的长度) 方法，对用户的密码进行加密处理：
		// 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
		userinfo.password = bcrypt.hashSync(userinfo.password, 10)

		// 向 my_db_01 数据库的 users 表插入新用户
		const user = { username: userinfo.username, password: userinfo.password }
		const sql = 'insert into users set ?'
		db.query(sql, user, (err, results) => {
			// 执行 SQL 语句失败
			if (err) {
				return res.send({
					status: 0,
					msg: err.message,
				})
			}
			// SQL 语句执行成功，但影响的行数不为 1
			if (results.affectedRows !== 1) {
				return res.send({
					status: 0,
					msg: '注册新用户失败，请稍后重试!',
				})
			}
			return res.send({
				status: 0,
				msg: '注册成功!',
			})
		})
	})
}

// 登录的处理函数
exports.login = (req, res) => {
	// 1.接收表单数据：
	const userinfo = req.body
	// 2.判断用户名和密码是否为空
	// 2.定义 SQL 语句
	const sql = `select * from user where username=?`
	// 3.执行 SQL 语句，查询用户的数据：
	db.query(sql, userinfo.username, function (err, results) {
		// 执行 SQL 语句失败
		if (err)
			return res.send({
				status: 0,
				msg: err,
			})
		// 执行 SQL 语句成功，但是查询到数据条数不等于 1
		if (results.length !== 1)
			return res.send({
				status: 0,
				msg: '登录失败，用户不存在!',
			})
		// TODO：判断用户输入的登录密码是否和数据库中的密码一致
		// 核心实现思路：调用 bcrypt.compareSync(用户提交的密码, 数据库中的密码) 方法比较密码是否一致
		// 返回值是布尔值（true 一致、false 不一致）
		// 拿着用户输入的密码,和数据库中存储的密码进行对比
		const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
		// const compareResult = userinfo.password == results[0].password
		// 如果对比的结果等于 false, 则证明用户输入的密码错误
		if (!compareResult) {
			return res.send({
				status: 0,
				msg: '登录失败,账号密码错误!',
			})
		}

		// TODO：登录成功，生成 Token 字符串
		// 核心注意点：在生成 Token 字符串的时候，一定要剔除 密码 和 头像 的值
		// 剔除完毕之后，user 中只保留了用户的 id, username, nickname, email 这四个属性的值
		const user = { ...results[0], password: '', user_pic: '' }
		// 运行如下的命令，安装生成 Token 字符串的包：
		// npm i jsonwebtoken@8.5.1
		// 生成 Token 字符串
		// 参数1：用户的信息对象
		// 参数2：加密的秘钥
		// 参数3：配置对象，可以配置当前 token 的有效期
		// 记住：千万不要把密码加密到 token 字符中
		const tokenStr = jwt.sign(user, config.jwtSecretKey, {
			expiresIn: config.expiration_time, // token 有效期
		})
		res.send({
			status: 0,
			msg: '登录成功！',
			// 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
			token: 'Bearer ' + tokenStr,
		})
	})
}
