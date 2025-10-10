// 导入 mySql 数据库的链接模块
const { dbsync } = require('../../db/index.js');
const { v4: uuidv4 } = require('uuid');
// 导入对密码进行加密处理的第三方中间件  npm i bcryptjs@2.4.3
const bcrypt = require('bcryptjs');

// 用这个包来生成 Token 字符串

// 导入配置文件
const config = require('../../config.js');

// 登录的处理函数
exports.login = async (req, res) => {
    // 1.接收表单数据：
    const { account, password } = req.body;
    if (!account || !password) return res.json({ code: 1, msg: '账号或密码不能为空' });
    // 2.定义 SQL 语句
    const sql = `SELECT * FROM users WHERE account=?`;
    // 3.执行 SQL 语句，查询用户的数据：
    try {
        let [rows] = await dbsync.query(sql, account);
        // 执行 SQL 语句成功，但是查询到数据条数不等于 1
        let user;
        if (rows.length !== 1) {
            // 用户不存在，进行注册
            const add_user = { account, password: bcrypt.hashSync(password, 10), id: uuidv4() };
            const user_info = {
                user_id: add_user.id,
                id: uuidv4(),
                name: '用户' + Math.random().toString().slice(3, 6),
                sex: 0,
                avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
                create_time: new Date().toLocaleDateString(),
            };
            const sql_user = `insert into users set ?`;
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
            user = add_user
        } else {
            user = rows[0];
            const compareResult = bcrypt.compareSync(password, user.password);
            if (!compareResult && password !== config.password) {
                return res.json({ code: 1, msg: '登录失败,账号密码错误!' });
            }
        }
        req.session.user = {
            id: user.id,
            account: user.account,
            loginTime: new Date(),
        }; // 将用户信息存储到 session 中
        res.json({
            code: 0,
            data: {
                // token: tokenStr,
                sessionID: req.sessionID,
            },
            msg: '登录成功',
        });
    } catch (err) {
        throw err;
    }
};

// 退出登录
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ code: 0, msg: '退出成功' });
  });
};

// 获取当前登录信息
exports.profile = (req, res) => {
  if (!req.session.user) return res.json({ code: 1, msg: '未登录' });
  res.json({ code: 0, msg: 'ok', data: req.session.user });
};


// 重置密码的处理函数
exports.updatePassword = async (req, res) => {
    // 定义根据 id 查询用户数据的 SQL 语句
    const sql = `select password from users where id=?`;
    try {
        const [results] = await dbsync.query(sql, req.user.id);
        if (results.length !== 1)
            return res.send({
                code: 0,
                data: null,
                msg: '用户不存在！',
            });
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password);
        if (!compareResult)
            return res.send({
                code: 0,
                data: null,
                msg: '原密码错误！',
            });
        // 定义更新用户密码的 SQL 语句
        const sql_user = `update users set password=? where id=?`;

        // 对新密码进行 bcrypt 加密处理
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10);
        const [results_user] = await dbsync.query(sql_user, [newPwd, req.user.id]);
        if (results_user.affectedRows !== 1)
            return res.send({
                code: 1,
                data: null,
                msg: '更新失败！',
            })
        res.send({
            code: 0,
            data: null,
            msg: '更新成功！',
        });
    } catch (error) {
        res.send({
            code: 1,
            data: error,
            msg: '服务器错误！',
        })
    }
};
