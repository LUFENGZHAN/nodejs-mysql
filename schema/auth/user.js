// 用户信息验证模块

// 使用第三方的中间件验证表单数据
const joi = require('joi')

/**
 * https://joi.dev/api/?v=17.13.0
 * string() 值必须是字符串  默认情况不支持空字符串  Joi.string().allow('') 支持空字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 * number()值必须是一个数字
 * email()值必须是邮箱格式
 */

// 用户名的验证规则
const username = joi.string().alphanum().min(6).max(16).required()

// 密码的验证规则   6~12位  [\S]表示，非空白就匹配  [\s] 只要出现空白就匹配
// /^[a-z0-9_-]{6,16}$/ = 以非空白的元素开头和结尾数量6-16
const password = joi
	.string()
	.pattern(/^[a-z0-9_-]{6,16}$/)
	.required()

// 登录表单的验证规则对象
exports.reg_login_schema = {
	// 表示需要对 req.body 中的数据进行验证
	body: {
		username,
		password,
	},
}

// 定义 id 的验证规则
const id = joi.string().min(36).required()
const avatar = joi.string().allow('').required()
const sex = joi.number().required()
const name = joi.string().required()

// 验证规则对象 - 更新用户基本信息
exports.update_userinfo_schema = {
	body: {
		id,
        avatar,
        sex,
        name
	},
}

// 验证规则对象 - 重置密码
exports.update_password_schema = {
	body: {
		// 使用 password 这个规则，验证 req.body.oldPwd 的值
		oldPwd: password,
		// 使用 joi.not(joi.ref('oldPwd')).concat(password) 规则，验证 req.body.newPwd 的值
		// 解读：
		// 1. joi.ref('oldPwd') 表示 newPwd 的值必须和 oldPwd 的值保持一致
		// 2. joi.not(joi.ref('oldPwd')) 表示 newPwd 的值不能等于 oldPwd 的值
		// 3. .concat() 用于合并 joi.not(joi.ref('oldPwd')) 和 password 这两条验证规则
		newPwd: joi.not(joi.ref('oldPwd')).concat(password),
	},
}

// 头像的验证规则就不需要了，因为在router/userinfo内使用 multer 来解析数据自带验证
// 头像图片的验证规则
// dataUri() 指的是如下格式的字符串数据：
// data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
// const avatar = joi.string().dataUri().required()

// 验证规则对象 - 更新头像
// exports.update_avatar_schema = {
//   body: {
//     avatar,
//   },
// }
