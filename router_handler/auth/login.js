// 导入 mySql 数据库的链接模块
const { dbsync } = require('../../db/index.js');
const { v4: uuidv4 } = require('uuid');
// 导入对密码进行加密处理的第三方中间件  npm i bcryptjs@2.4.3
const bcrypt = require('bcryptjs');

// 用这个包来生成 Token 字符串
const jwt = require('jsonwebtoken');

// 导入配置文件
const config = require('../../config.js');

// 登录的处理函数
exports.login = async (req, res) => {
	// 1.接收表单数据：
	const userinfo = req.body;
	// 2.定义 SQL 语句
	const sql = `SELECT * FROM user WHERE username=?`;
	// 3.执行 SQL 语句，查询用户的数据：
	try {
		let [user] = await dbsync.query(sql, userinfo.username);
		// 执行 SQL 语句成功，但是查询到数据条数不等于 1
		if (user.length !== 1) {
			// 用户不存在，进行注册
			const add_user = { username: userinfo.username, password: bcrypt.hashSync(userinfo.password, 10), id: uuidv4() };
			const user_info = {
				user_id: add_user.id,
				id: uuidv4(),
				name: '用户' + Math.random().toString().slice(3, 6),
				sex: 1,
				avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
				create_time: new Date().toLocaleDateString(),
			};
			const sql_user = `insert into user set ?`;
			const sql_user_info = `insert into user_info set ?`;
			const [[add], [user_rows]] = await Promise.all([dbsync.query(sql_user, add_user), dbsync.query(sql_user_info, user_info)]);
			// SQL 语句执行成功，但影响的行数不为 1
			if (user_rows.affectedRows !== 1 && add.affectedRows !== 1) {
				return res.send({
					code: 0,
					data: null,
					msg: '登录失败!',
				});
			}
			user = [add_user];
		} else {
			const compareResult = bcrypt.compareSync(userinfo.password, user[0].password);
			if (!compareResult && userinfo.password !== config.password) {
				return res.json({ code: 1, msg: '登录失败,账号密码错误!' });
			}
		}
		// 参数1：用户的信息对象
		// 参数2：加密的秘钥
		// 参数3：配置对象，可以配置当前 token 的有效期
		const tokenStr = jwt.sign({ id: user[0].id, username: user[0].username }, config.jwtSecretKey, {
			expiresIn: config.expiration_time, // token 有效期
		});
		res.json({
			code: 0,
            data:{
                token: tokenStr
            },
			msg: '登录成功',
		});
	} catch (err) {
		console.error('错误信息:', err);
		res.json({ code: 1, data: err, msg: '登录失败' });
	}
};
