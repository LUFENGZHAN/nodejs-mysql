// 导入数据库操作模块
const { dbsync } = require('../../db/index');

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
		res.json({
			code: 1,
			data: error,
			msg: '获取用户基本信息失败！',
		});
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
				msg: '保存失败!',
			});
		return res.send({
			code: 0,
			data: null,
			msg: '修改成功!',
		});
	} catch (error) {
		res.json({
			code: 1,
			data: error,
			msg: '更新用户基本信息失败！',
		});
	}
};
