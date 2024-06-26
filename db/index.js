const mysql = require('mysql2');

// 创建数据库连接对象
const db = mysql.createPool({
	host: 'localhost',
	user: 'root', // 本地
	// user: 'my_db_01', // 线上
	password: '320332369',
	database: 'mysql_node',
});
// 检测 mysql 模块能否正常工作
// 调用 db.query() 函数，指定要执行的 SQL 语句，通过回调函数拿到执行的结果：
db.query('select 1', (err, results) => {
	if (err) return console.log(err.message);
	// 只要能打印出 [ RowDataPacket { '1': 1 } ]的结果，就能证明数据库链接正常
	console.log('mysql链接成功');
});
// 向外共享 db 数据库连接对象
exports.dbsync = db.promise();
exports.db = db;
