// 验证token中间件

//导入 jwt
const jwt = require('jsonwebtoken')
const { secret } = require('../config/config')
// 创建一个 Set 来存储失效 Token
const invalidatedTokens = new Set();
module.exports = (req, res, next) => {
    //   获取token
    let token = req.headers.token
    if (!token) {
        return res.state(401).json({
            code: 401,
            msg: 'token缺少',
            data: null
        })
    }

    //校验token
    jwt.verify(token, secret, (err, data) => {
        // 检测token是否正确
        // console.log(data)
        if (err) {
            return res.state(401).json({
                code: 401,
                msg: 'token校验失败',
                data: null
            })
        }
        // 在req中追加user属性，其它地方能通过req.user直接使用
        req.user = data;
        next()
    })

}
