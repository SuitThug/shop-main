var express = require('express');
var router = express.Router();

// 引入模型
const UserModel = require('../../models/userModel')
const Menu = require('../../models/MenuModel')

// 引入中间件
const checkTokenMiddleware = require('../../middlewares/checkTokenMiddleware')
// 引入md5进行密码加密
var md5 = require('md5');
// 引入jwt
var jwt = require('jsonwebtoken');
const { secret } = require('../../config/config')

// 注册用户
router.post('/admin/register', function (req, res, next) {
  console.log(req.body)
  const { username, password, phone } = req.body
  UserModel.find({ phone }).then(data => {
    console.log(data)
    if (data.length != 0) {
      //  用户存在
      res.json({
        code: 201,
        msg: '用户已存在',
        data: null
      })
    } else {
      // 用户不存在，可以注册
      UserModel.create({ username: username, password: md5(password), phone: phone }).then(data => {
        res.json({
          code: 200,
          msg: '注册成功',
          data: data
        })
      }).catch(err => {
        // console.log(err)
        if (err) {
          res.json({
            // 响应编号
            code: 202,
            //  响应信息
            msg: '注册失败~',
            // 响应数据
            data: null
          })
          return
        }
      })
    }
  })

})


// 用户登录接口
router.post('/admin/login', function (req, res) {
  const { phone, password } = req.body
  console.log(phone, password)
  UserModel.findOne({ phone: phone, password: md5(password) }).then(data => {
    // console.log('success')
    console.log(data)
    if (!data) {
      return res.json({
        code: 202,
        msg: '用户名或密码错误~~~',
        data: null
      })
    }

    // 生成token
    let token = jwt.sign({ username: data.username, _id: data._id }, secret, { expiresIn: 60 * 60 * 24 * 7 });
    res.json({
      code: 200,
      msg: '登录成功',
      data: token
    })

  }).catch(err => {
    // console.log(err)
    return res.json({
      code: 201,
      msg: '登录失败~服务器出错',
      data: null
    })
  })
})

// 用户详情接口
router.get('/admin/userInfo', checkTokenMiddleware, (req, res) => {
  let { _id } = req.user
  UserModel.findById({ _id: _id }).then(data => {
    console.log(data)
    res.json({
      code: 200,
      msg: '用户详细信息获取成功',
      data: data
    })

  }).catch(err => {
    return res.json({
      code: 201,
      msg: '用户详细信息获取失败',
      data: null
    })
  })

})

// 用户列表
router.get('/api/admin/userList/:pageNo/:limit', checkTokenMiddleware, async (req, res) => {
  console.log(req.params)
  const { pageNo, limit } = req.params
  const skipPageNo = (pageNo - 1) * limit
  try {
    const data = await UserModel.find().skip(skipPageNo).limit(limit).sort({createTime:-1})
    const total = await UserModel.countDocuments()
    console.log(total)
    res.json({
      code: 200,
      msg: '用户列表获取成功',
      data: data,
      total: total
    })
  } catch (error) {
    return res.json({
      code: 201,
      msg: '用户列表信息获取失败',
      data: error
    })
  }


})

// 删除用户
router.post('/api/delUser', (req, res) => {
  let { ids } = req.body
  console.log(ids)
  UserModel.deleteMany({ _id: { $in: ids } }).then(data => {
    res.json({
      code: 200,
      msg: '删除成功',
      data: data
    })
  }).catch(error => {
    res.json({
      code: 201,
      msg: '删除失败',
      data: error
    })
  })

})

// 更新
router.post('/api/updateUser', (req, res) => {
  // let { _id } = req.body
  let obj = {
    updateTime: new Date(),
    ...req.body
  }
  console.log(req.body)
  UserModel.updateOne({ _id: obj._id }, obj).then(data => {
    res.json({
      code: 200,
      msg: '更新成功',
      data: data
    })
  }).catch(error => {
    res.json({
      code: 201,
      msg: '更新失败',
      data: error
    })
  })

})

// 退出登录
router.get('/admin/logout', (req, res) => {
  res.json({
    code: 200,
    msg: '退出成功',
    data: null
  })
})


// 获取当前用户的菜单 --动态路由追加/查询用户权限需要这个接口
router.post("/api/getUserMenu", async (req, res) => {
  try {
    const { uid } = req.body;
    // 查询用户
    const user = await UserModel.findById(uid)
    //查询菜单
    const menuList = await Menu.find();
    let userMenuList = [];
    // res.send(user);
    user.roles.forEach(element => {
      if (element == "超级管理员") {
        res.send(menuList);
        console.log('有超级管理员')
      } else {
        /**
         * 如果不是超级管理员那么就把用户详情表中的路由权限值与菜单表进行对比
         */
        user.routes.forEach((rid) => {
          menuList.forEach((menu) => {
            if (menu.rid == rid) {
              userMenuList.push(menu);
            }
          });
        });
        console.log('普通')
        res.send(userMenuList);
      }
      
    });

  } catch (err) {
    res.status(401).send("请先登录");
  }
});


module.exports = router;
