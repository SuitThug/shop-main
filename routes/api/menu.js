var express = require('express');
var router = express.Router();
const Menus = require('../../models/MenuModel')
const Role = require('../../models/RoleModel')

// 添加菜单
router.post('/insertParentMenu', async (req, res) => {
    console.log(req.body)
    try {
        const { icon, path, title, pid } = req.body;
        const menuItem = {
            icon,
            name: path.match(/\/([^/]*)$/)[1],
            path,
            title,
            pid: pid ? pid : 0,
        };
        console.log(menuItem);
        await Menus.create(menuItem);
        res.json({ code: 200, msg: '创建菜单成功' })
       


    } catch {
        res.status(404).send("菜单格式有误");
    }
})



// 获取全部菜单
router.get('/acl/queryMenu', async (req, res) => {
    try {
        const data = await Menus.find()
        res.json({ code: 200, data: data, msg: "查询成功" })
    } catch (error) {
        res.status(500).json({ msg: error })
    }
})
// 更新菜单
router.post("/updateMenu", async (req, res) => {
    try {
        const { _id, pid } = req.body;
        const unpassStr = "64f6234f67dceee3d249afb4";
        const menu = await Menus.findById(unpassStr);
        if (_id === unpassStr || pid === menu.rid) {
            res.status(403).json({
                msg: '"权限菜单已被后台锁定,无法修改"'
            });
            return;
        }
        await Menus.findByIdAndUpdate(_id, req.body);
        res.json({ code: 200, msg: '更新成功' });
    } catch (error) {
        res.status(500).send('服务器出错')
    }
});


module.exports = router