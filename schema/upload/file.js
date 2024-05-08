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