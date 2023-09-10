// 漫画集合 
//导入 mongoose
const mongoose = require('mongoose')
// 时间格式化插件
const moment = require('moment')
// 创建文档结构对象
let ComicsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true 
    },
    category_id: {
        type: String,
        required: true,
    },
    status: {
        type: Number,
        required: true,
        default: 1
    },
    read:{
        type:Number,
        required:true,
        default:0
    },
    imageUrl: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    createTime: {
        type: Date,
        required: true,
        default: moment().format('lll')
    },
    updateTime: {
        type: Date,
        default: ''
    },

})

// 创建文档模型
let ComicsModel = mongoose.model('comics', ComicsSchema)

// 暴露模型
module.exports = ComicsModel;