// 数据池

module.exports = function (success, error) {
    // 这样其它地方调用，只需要传成功回调函数，失败结果在这里统一处理
    if (typeof error !== 'function') {
        error = () => {
            console.log('连接失败')
        }
    }
    //1. 安装 mongoose
    //2. 导入 mongoose
    const mongoose = require('mongoose')
    // 导入配置文件
    const { DBHOST, DBPORT, DBNAME } = require('../config/config')

    // 3.连接数据库
    //  mongoose.connect('mongodb://127.0.0.1:27017/cartoon_shop');
    mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`,{ useNewUrlParser: true, useUnifiedTopology: true});

    // 连接成功
    // mongoose.connection.on('open', () => {

    // })
    // 成功回调
    success()
    // 连接失败
    mongoose.connection.on('error', () => {
        // 失败回调
        error()
    })


    // 连接关闭
    mongoose.connection.on('close', () => {
        console.log('连接关闭')
    })
}