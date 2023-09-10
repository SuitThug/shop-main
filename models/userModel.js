//导入 mongoose
const mongoose = require('mongoose');
const moment = require('moment')
// 创建文档结构对象
//设置集合中稳定的属性以及属性值的类型
let UserSchema = new mongoose.Schema({
    // 用户名
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif"
    },
    routes: {
        type: Array,
        default: [],
        ref: "Role" 
    },
    roles:{
        type: Array,
        default:['普通用户']
    },
    createTime: {
        type: Date,
        required: true,
        default:moment().format('lll')
    },
    updateTime: {
        type: Date,
        default:new Date()
    },

})

// 创建文档模型对象 对文档操作的封装对象
let UserModel = mongoose.model('users', UserSchema);

// 暴露模型
// exports !!!!!!!!!
module.exports = UserModel;