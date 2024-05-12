/**
 * 在这里定义和用户信息相关的路由处理函数，供 /router/userinfo.js 模块进行调用
 */

// 导入数据库操作模块
const { dbsync } = require('../../db/index');

// 导入文件操作模块
const fs = require('fs');
// 导入处理路径的 path 核心模块
const path = require('path');

// 导入对密码进行加密处理的第三方中间件  npm i bcryptjs@2.4.3
const bcrypt = require('bcryptjs');

// 获取用户基本信息的处理函数
exports.getUserInfo = async (req, res) => {
	// 根据用户的 id，查询用户的基本信息
	const sql = `select * from user_info where user_id=?`;
	try {
		const [[results]] = await dbsync.query(sql, req.user.id);
		// 将用户的基本信息响应给客户端
		res.send({
			code: 0,
			data: results,
			msg: '获取用户基本信息成功！',
		});
	} catch (error) {
		console.error('错误信息:', error);
		res.json({
			code: 1,
			data: error,
			msg: '获取用户基本信息失败！',
		});
	} finally {
         // 关闭数据库连接
	}
};

// 更新用户基本信息的处理函数
exports.updateUserInfo = async (req, res) => {
	const sql = `update user_info set ? where id=?`;
	try {
		const [results] = await dbsync.query(sql, [req.body, req.body.id]);
		if (results.affectedRows !== 1)
			return res.send({
				code: 0,
				data: null,
				msg: '修改用户基本信息失败！',
			});
		return res.send({
			code: 0,
			data: null,
			msg: '修改用户基本信息成功！',
		});
	} catch (error) {
		res.json({
			code: 1,
			data: error,
			msg: '更新用户基本信息失败！',
		});
	}
};

// 重置密码的处理函数
exports.updatePassword = (req, res) => {
	// 定义根据 id 查询用户数据的 SQL 语句
	const sql = `select * from user where id=?`;

	// 执行 SQL 语句查询用户是否存在
	db.query(sql, req.user.id, (err, results) => {
		// 执行 SQL 语句失败
		if (err)
			return res.send({
				code: 0,
				data: null,
				msg: err,
			});

		// 检查指定 id 的用户是否存在
		if (results.length !== 1)
			return res.send({
				code: 0,
				data: null,
				msg: '用户不存在！',
			});

		// TODO：判断提交的旧密码是否正确
		// 在头部区域导入 bcryptjs 后，（因为数据库中的密码是加密过的）
		// 即可使用 bcrypt.compareSync(提交的密码，数据库中的密码) 方法验证密码是否正确
		// compareSync() 函数的返回值为布尔值，true 表示密码正确，false 表示密码错误

		// 判断提交的旧密码是否正确
		const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password);
		if (!compareResult)
			return res.send({
				code: 0,
				data: null,
				msg: '原密码错误！',
			});

		// 对新密码进行 bcrypt 加密之后，更新到数据库中：
		// 定义更新用户密码的 SQL 语句
		const sql = `update user_info set password=? where id=?`;

		// 对新密码进行 bcrypt 加密处理
		const newPwd = bcrypt.hashSync(req.body.newPwd, 10);
		// 执行 SQL 语句，根据 id 更新用户的密码
		db.query(sql, [newPwd, req.user.id], (err, results) => {
			// SQL 语句执行失败
			if (err)
				return res.send({
					code: 0,
					data: null,
					msg: err,
				});

			// SQL 语句执行成功，但是影响行数不等于 1
			if (results.affectedRows !== 1)
				return res.send({
					code: 1,
					data: null,
					msg: '更新密码失败！',
				});

			// 更新密码成功
			res.send({
				code: 0,
				data: null,
				msg: '更新密码成功！',
			});
		});
	});
};

// 更新用户头像的处理函数
exports.updateAvatar = (req, res) => {
	// req.files/req.file 是上传成功文件的信息对象 (.array req.files  .single('avatar') req.file)
	// req.body 上传文件时所携带的其他文本表单数据
	let file = req.files[0];
	// 手动判断是否上传了头像
	if (!file || file.fieldname !== 'avatar')
		return res.send({
			code: 0,
			data: null,
			msg: '头像是必选参数！',
		});
	// Date.now() 返回自 1970 年 1 月 1 日 00:00:00 (UTC) 到当前时间的毫秒数。类型为 number,
	// toString() 方法返回 string 类型。
	// file.originalname 文件的名称包含了格式 如： 'äººè\x84¸.PNG'
	// 这里写相对路径

	// 定义新的文件名
	// let Url = 'public/image/head_portrait/' + Date.now().toString() + '_' + req.file.originalname
	let Url = path.join('public/image/head_portrait/', file.originalname); // 覆盖重复的文件

	// fs.rename()：重命名文件或文件夹 同步
	// fs.renameSync(oldPath，newPath) 异步 oldPath 原路径 newPath 新路径
	fs.renameSync(path.join('./public/image/head_portrait/', file.filename), Url); // 设置文件名
	// 图片访问路径
	const imgUrl = `/${Url}`;

	const sql = 'update user_info set user_pic=? where id=?';
	// 调用 db.query() 执行 SQL 语句，更新对应用户的头像：
	// req.body.avatar 是一个base（贝s）64字符串,可以直接用img 标签展示
	db.query(sql, [imgUrl, req.user.id], (err, results) => {
		// 执行 SQL 语句失败
		if (err)
			return res.send({
				code: 0,
				data: null,
				msg: err,
			});

		// 执行 SQL 语句成功，但是影响行数不等于 1
		if (results.affectedRows !== 1)
			return res.send({
				code: 0,
				data: null,
				msg: '更新头像失败！',
			});
		// 更新用户头像成功
		res.send({
			code: 0,
			data: null,
			msg: '更新头像成功',
			imgUrl: imgUrl,
		});
	});
};
