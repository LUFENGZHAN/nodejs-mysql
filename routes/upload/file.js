const express = require('express'); // 引入express模块
const router = express.Router(); // 创建路由对象
const { dbsync } = require('../../db'); // 引入数据库操作模块
const { v4: uuidv4 } = require('uuid');
const joi = require('joi'); // 引入joi模块
const fs = require('fs'); // 引入文件操作模块
const path = require('path'); // 引入路径模块
const config = require('../../config'); // 引入配置文件
const expressjoi = require('@escook/express-joi'); // 引入处理路径的模块
const verifyVlaue = {
    body: {
        type: joi.string().required(),
    },
};
// 文件上传
router.post('/upload', expressjoi(verifyVlaue), async (req, res) => {
    try {
        if (req.files.length === 0) {
            return res.json({
                code: 1,
                data: null,
                message: '没有上传文件',
            });
        }
        const filePath = path.join(__dirname, `../../public/${req.body.type}`);
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath);
        }
        const url = `${config.networkIp}:${config.port}/${req.body.type}/`;
        const files = await req.files.map(item => {
            const fileExt = path.extname(item.originalname);
            const newFileName = `${uuidv4().replace(/-/g, '_')}${fileExt}`;
            const writePath = path.join(filePath, newFileName);
            fs.writeFileSync(writePath, item.buffer);

            return {
                id: uuidv4(),
                file_name: item.originalname.replace(fileExt, ''),
                file_type: item.mimetype,
                file_size: item.size,
                uploader_id: req.user.id, // 上传者id
                file_path: url + newFileName,
                upload_time : new Date().toLocaleString(),
            };
        });
        // 插入数据库
        const insertPromises = files.map(file => {
            return dbsync.query('INSERT INTO files SET ?', file);
        });
        Promise.all(insertPromises)
            .then(() => {
                const responseData = {
                    code: 0,
                    data: files.length === 1 ? files[0] : files,
                    message: '上传成功',
                };
                res.json(responseData);
            })
            .catch(error => {
                const responseData = {
                    code: 1,
                    data: error,
                    message: '上传失败',
                };
                files.forEach(file => {
                    fs.unlinkSync(path.join(filePath, file.url.split('/').pop()));
                })
                res.json(responseData);
            });
    } catch (error) {
        res.json({
            code: 1,
            data: error,
            message: '文件上传失败',
        });
    }
});

module.exports = router;
