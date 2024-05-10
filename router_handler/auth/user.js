/**
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */
// 导入 mySql 数据库的链接模块
const {dbsync, db} = require('../../db/index.js')
const { v4: uuidv4 } = require('uuid')
// 导入对密码进行加密处理的第三方中间件  npm i bcryptjs@2.4.3
const bcrypt = require('bcryptjs')

// 用这个包来生成 Token 字符串
const jwt = require('jsonwebtoken')

// 导入配置文件
const config = require('../../config.js')

// 注册用户的处理函数
exports.regUser = async(req, res) => {
	// 1.判断用户名和密码是否为空
	// 接收表单数据
	const userinfo = req.body
	// 2.检测用户名是否被占用
	// 定义 SQL 语句：
	const sql = `select * from user where username=?`
	// 执行 SQL 语句并根据结果判断用户名是否被占用：
	db.query(sql, [userinfo.username], function (err, results) {
		// 执行 SQL 语句失败
		if (err) {
			return res.send({
				code: 0,
				data: null,
				msg: err.message,
			})
		}
		// 用户名被占用
		if (results.length > 0) {
			return res.send({
				code: 0,
				data: null,
				msg: '用户名被占用，请更换其他用户名!',
			})
		}
		// TODO: 用户名可用，继续后续流程...
		// 调用 bcrypt.hashSync(明文密码, 随机盐的长度) 方法，对用户的密码进行加密处理：
		// 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
		userinfo.password = bcrypt.hashSync(userinfo.password, 10)
		// 向 my_db_01 数据库的 users 表插入新用户
		const user = { username: userinfo.username, password: userinfo.password, id: uuidv4() }
		const sql = 'insert into user set ?'
		db.query(sql, user, (err, results) => {
			// 执行 SQL 语句失败
			if (err) {
				return res.send({
					code: 0,
					data: null,
					msg: err.message,
				})
			}
			// SQL 语句执行成功，但影响的行数不为 1
			if (results.affectedRows !== 1) {
				return res.send({
					code: 0,
					data: null,
					msg: '注册新用户失败，请稍后重试!',
				})
			}
			const user_info = {
				user_id: user.id,
				id: uuidv4(),
				name: '用户' + Math.random().toString().slice(3, 6),
				sex: 1,
				avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
				create_time: new Date().toLocaleDateString(),
				update_time: new Date().toLocaleDateString(),
			}
			db.query('insert into user_info set ?', user_info, (err, results) => {
				if (err) {
					return res.send({
						code: 0,
						data: null,
						msg: err.message,
					})
				}
				// SQL 语句执行成功，但影响的行数不为 1
				if (results.affectedRows !== 1) {
					return res.send({
						code: 0,
						data: null,
						msg: '注册新用户失败，请稍后重试!',
					})
				}
				// TODO：注册成功
				return res.send({
					code: 0,
					data: null,
					msg: '注册成功!',
				})
			})
		})
	})
}

// 登录的处理函数
exports.login = async (req, res) => {
	// 1.接收表单数据：
	const userinfo = req.body
	// 2.判断用户名和密码是否为空
	// 2.定义 SQL 语句
	const sql = `select * from user where username=?`
	// 3.执行 SQL 语句，查询用户的数据：
	try {
		const [rows, r] = await dbsync.query(sql, userinfo.username)
		// 执行 SQL 语句成功，但是查询到数据条数不等于 1
		if (rows.length !== 1)
			return res.json({
				code: 1,
				msg: '登录失败，用户不存在!',
			})
		// 拿着用户输入的密码,和数据库中存储的密码进行对比
		const compareResult = bcrypt.compareSync(userinfo.password, rows[0].password)
		// 如果对比的结果等于 false, 则证明用户输入的密码错误
		if (!compareResult) {
			return res.json({
				code: 1,
				msg: '登录失败,账号密码错误!',
			})
		}
		// 生成 Token 字符串
		const user = { ...rows[0], password: '' }
		// 参数1：用户的信息对象
		// 参数2：加密的秘钥
		// 参数3：配置对象，可以配置当前 token 的有效期
		const tokenStr = jwt.sign(user, config.jwtSecretKey, {
			expiresIn: config.expiration_time, // token 有效期
		})
		res.json({
			code: 0,
			msg: '登录成功！',
			// 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
			token: 'Bearer ' + tokenStr,
		})
	} catch (err) {
		return res.json({
			code: 1,
			msg: err,
		})
	}
}
