//导入 mongoose
const mongoose = require('mongoose');
const moment = require('moment')
// 创建文档结构对象
//设置集合中稳定的属性以及属性值的类型
let RoleSchema = new mongoose.Schema({
    roleName: { type: String },
    describe: { type: String },
    roleMenus: { type: Array },
    createTime: { type: Date, default: new Date() },
    updateTime: { type: Date, default: new Date() },
})

// 创建文档模型对象 对文档操作的封装对象
let RoleModel = mongoose.model('roles', RoleSchema);

// 暴露模型
// exports !!!!!!!!!
module.exports = RoleModel;