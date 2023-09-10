var express = require('express');
var router = express.Router();
const RoleModel = require('../../models/RoleModel')
const UserModel = require('../../models/userModel')
const Menu = require('../../models/MenuModel')

const moment = require('moment')
// 添加角色
router.post('/acl/addRole', (req, res) => {
    console.log(req.body)
    let { roleName } = req.body
    const newRoleName = {
        roleName,
        updateTime: new Date(),
        createTime: moment().format()
    }
    RoleModel.create(newRoleName).then(data => {
        res.json({ code: 200, msg: '添加成功', data: data })
    }).catch(error => {
        res.status(500).json({ msg: error })
    })

})
// 角色列表
router.get('/acl/roleList', async (req, res) => {
    console.log(req.query)
    const { pageNo, limit } = req.query
    const skipPageNo = (pageNo - 1) * limit
    try {
        const role = await RoleModel.find().select({ __v: 0 }).skip(skipPageNo).limit(limit).sort({createTime:-1})
        const total = await RoleModel.countDocuments()
        res.json({
            code: 200,
            msg: '查询成功',
            total: total,
            data: role

        })
    } catch (error) {
        res.json({
            code: 500,
            msg: '查询失败',
            data: error
        })
    }


})
// 删除角色
router.post('/acl/delRole', async function (req, res) {
    // 传过来的值会变为字符串，需要转换为josn对象格式
    try {
        console.log(req.body)
        let ids = eval(req.body.ids);
        // 批量删除:$in -->传一个数组
        const targetRole = await RoleModel.findById(ids);
        // console.log(targetRole)
        if (targetRole.roleName !== "超级管理员") {
            RoleModel.deleteMany({ _id: { $in: ids } }).then(data => {
                res.json({
                    code: 200,
                    msg: '删除成功',
                    data: data
                })
            }).catch(err => {
                return res.json({
                    code: 203,
                    msg: '删除失败',
                })
            })
        } else {
            res.send({
                status: 201,
                msg: "无法删除超级管理员",
            });
        }
    } catch (error) {
        res.status(500).send({
            msg: "服务器出现问题",
        });
    }

})



// 更新角色名
router.post('/acl/updateRole', async function (req, res) {
    // 传过来的值会变为字符串，需要转换为josn对象格式

    try {
        let obj = {
            ...req.body,
            updateTime: moment().format()
        }
        const targetRole = await RoleModel.findById(obj._id);
        // console.log(targetRole)
        if (targetRole.roleName !== "超级管理员") {
            RoleModel.updateOne({ _id: req.body._id }, obj).then(data => {
                res.json({
                    code: 200,
                    msg: '更新成功',
                    data: data
                })
            }).catch(err => {
                return res.json({
                    code: 203,
                    msg: '更新失败',
                    data: err
                })
            })
        } else {
            res.send({
                status: 201,
                msg: "无法更改超级管理员的权限",
            });
        }
    } catch (error) {
        res.status(500).send({
            msg: "服务器出现问题",
        });
    }

})

// 根据角色id获取角色菜单
router.get("/getRoleMenu", async (req, res) => {
    try {
        const { id } = req.query;
        // 查询角色
        const role = await RoleModel.findById(id).lean();
        // 查询菜单
        const menuList = await Menu.find();
        let roleMenu = [];
        // 遍历角色，拿到存储的id与菜单id进行对比
        role.roleMenus.forEach((rid) => {
            menuList.forEach((menu) => {
                if (menu.rid == rid) {
                    roleMenu.push(menu.rid);
                }
            });
        });
        res.json({ code: 200, data: roleMenu });
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: '服务器出错' })
    }
});


// 获取全部菜单
router.get("/getMenuList", async (req, res) => {
    const list = await Menu.find();
    res.send(list);
});


// 更新角色菜单
router.post("/updateRoleMenu", async (req, res) => {
    const { roleMenuIds, id } = req.body;
    // console.log(req.body)
    const targetRole = await RoleModel.findById(id);


    // console.log(targetRole)
    if (targetRole.roleName !== "超级管理员") {
        targetRole.roleMenus = roleMenuIds;
        // 更新用户权限菜单字段
        const user = await UserModel.find({ roles: targetRole.roleName }).lean()
        const routesId = user.map(item=> item._id )
        console.log(routesId)
        // $in匹配多个
        const query = { _id:routesId};
        const update = { $set: {routes:roleMenuIds}};
        await UserModel.updateMany(query,update)
        targetRole.save();
        res.send({
            code: 200,
            msg: '权限修改成功',
        });



    } else {
        res.send({
            status: 201,
            msg: "无法更改超级管理员的权限",
        });
    }
});


// 更新职位
router.post("/updateUserRole", async (req, res) => {
    console.log(req.body)
    try {
        const { id, roleId } = req.body
        const user = await UserModel.findById(id)
        const role = await RoleModel.findById(roleId)
        user.roles = role.roleName
        user.routes = role.roleMenus
        user.save()
        res.send({ code: 200, msg: '职位更新成功' })
    } catch (error) {
        res.status(500).send({
            msg: '服务器出错'
        })
    }

});

// 查询角色
router.get("/queryRole", async (req, res) => {
    console.log(req.query)
    try {
        const { id } = req.body
        const role = await RoleModel.findById(id)
        user.save()
        res.send({ code: 200, msg: '查询成功', data: role })
    } catch (error) {
        res.status(500).send({
            msg: '服务器出错'
        })
    }

});

module.exports = router