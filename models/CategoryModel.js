//导入 mongoose
const mongoose = require('mongoose')
// 时间格式化插件
const moment = require('moment')
// 创建文档结构对象
let CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true,
        default: 1
    },
    createTime: {
        type: Date,
        required: true,
        default:moment().format('lll')
    },
    updateTime: {
        type: Date,
        default: ''
    },
})

// 创建文档模型
let CategoryModel = mongoose.model('categorys', CategorySchema)

// 暴露模型
module.exports = CategoryModel;