var express = require('express');
var router = express.Router();
const moment = require('moment')
// 引入模型
const category = require('../../models/CategoryModel')
// 引入中间件
const checkTokenMiddleware = require('../../middlewares/checkTokenMiddleware')
//添加分类
router.post('/category/addCategory', function (req, res) {
    console.log(req.body)
    // let {category_id,name} =req.body
    category.find({ ...req.body }).then(data => {
        if (data.length != 0) {
            res.json({
                code: 202,
                msg: '分类重复添加',
                data: null
            })
        } else {
            category.create({ ...req.body }).then(data => {
                res.json({
                    code: 200,
                    msg: '成功',
                    data: data
                })
            }).catch(err => {
                return res.json({
                    code: 201,
                    msg: '添加分类失败',
                    data: err
                })
            })
        }
    }).catch(err => {
        return res.json({
            code: 203,
            msg: '服务器出错',
            data: err
        })
    })

})

// 删除分类
router.post('/category/delCategory', function (req, res) {
    // 传过来的值会变为字符串，需要转换为josn对象格式
    let ids = eval(req.body.id);
    console.log(ids)
    // 批量删除:$in -->传一个数组
    category.deleteMany({ _id: { $in: ids } }).then(data => {
        res.json({
            code: 200,
            msg: '删除成功',
            data: data
        })
    }).catch(err => {
        return res.json({
            code: 203,
            msg: '删除失败',
            data: err
        })
    })

})

// 更新分类
router.patch('/category/updateCategory', function (req, res) {
    // 传过来的值会变为字符串，需要转换为josn对象格式
    let obj = {
        updateTime: moment().format('lll'),
        ...req.body
    }
    console.log(obj)
    category.updateOne({ _id: req.body._id }, obj).then(data => {
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

})

// 分类列表
// 前端从路径拼接数据过来，接口需要占位符
router.get('/category/listCategory', async (req, res) => {
    // let { pageNo, limit } = req.params
    console.log(req.query)
    try {
        const pageNo = parseInt(req.query.pageNo) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skipDocuments = (pageNo - 1) * limit;
        const categoryQuery = await category.find().select({ __v: 0, createTime: 0, updateTime: 0 }).skip(skipDocuments).limit(limit)
        // 查询并返回总条数
        const totalDocuments = await category.countDocuments();
        res.json({
            code: 200,
            msg: '查询成功',
            data: categoryQuery,
            total: totalDocuments
        })

    } catch (error) {
        res.status(500).json({ error: '发生错误', })
    }
})

// 查询分类
router.get('/category/search/', async (req, res) => {
    // console.log(req.query)
    try {
        let keyword = req.query.searchKey
        const decodedData = decodeURIComponent(keyword); 
        // 构建查询条件，这里使用正则表达式进行模糊匹配
        const query = { name: { $regex: decodedData, $options: 'i' } };
        const searchData = await category.find(query).select({__v:0,createTime:0,updateTime:0})
        const total = searchData.length
        if (searchData.length > 0) {
            res.json({ code: 200, data: searchData,total:total});
        } else {
            res.json({ code: 200, data: searchData, msg: '没有符合的条件' });
        }

    } catch (error) {
        res.status(500).json({ code: 500, msg: 'An error occurred' });
    }
})



module.exports = router;