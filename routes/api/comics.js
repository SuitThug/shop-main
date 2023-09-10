var express = require('express');
var router = express.Router();
const moment = require('moment')
const app = new express()
const comicsCollection = require('../../models/ComicsModel')
const chapterCollection = require('../../models/ChapterModel')
const chapterIMG = require('../../models/ChapterImgModel')
// //引入七千牛配置
// const bodyparse = require('body-parser')
// // 解析数据
// app.use(bodyparse.json())
// 引入七牛云配置
const qiniuUtils = require('../../config/qiqianniu');

// 获取 Token 和定时更新 Token
setInterval(() => {
    const refreshedToken = qiniuUtils.refreshAndSetToken();
    console.log('Refreshed Token:', refreshedToken);
}, 3500 * 1000); // 3.5 * 1000 秒后更新 Token

// 上传图片token接口-处理请求
router.get('/upload/token', (req, res) => {

    const token = qiniuUtils.generateToken();
    res.status(200).json({
        code: 200,
        data: token,
        mes: '七牛云token生成成功'
    })
})

// 添加漫画
router.post('/api/comics/addcomics', async (req, res) => {
    console.log(req.body)
    try {
        const result = await comicsCollection.create(req.body);
        res.json({ code: 200, msg: "成功", data: result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "服务器出错了" })
    }

})

// 漫画作品列表
router.get('/api/comics/list', async (req, res) => {
    console.log(req.query)
    try {
        const pageNo = parseInt(req.query.pageNo) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const category_id = req.query.category_id ? { category_id: req.query.category_id } : {}
        const skipDocuments = (pageNo - 1) * limit; 0 * 3
        const selectId = { __v: 0, createTime: 0, updateTime: 0 }
        const result = await comicsCollection.find(category_id).skip(skipDocuments).limit(limit).select(selectId).sort({ createTime: -1 });
        // 查询并返回总条数
        const totalDocuments = await comicsCollection.countDocuments();
        res.json({ code: 200, msg: "成功", data: result, total: totalDocuments })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "服务器出错了" })
    }
})


// 漫画详情
router.get('/api/comics/details', async (req, res) => {
    console.log(req.query)
    try {
        // const selectId = { __v: 0, createTime: 0, updateTime: 0 }
        const id = req.query.cartoon_Id
        const result = await comicsCollection.findOne({ _id: id });
        res.json({ code: 200, msg: "成功", data: result, })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "服务器出错了" })
    }
})




// 删除漫画作品
router.post('/api/comics/delComics', async (req, res) => {
    // 传过来的值会变为字符串，需要转换为josn对象格式
    console.log(req.body)
    let ids = eval(req.body.ids);
    console.log(ids)
    // 批量删除:$in -->传一个数组
    comicsCollection.deleteMany({ _id: { $in: ids } }).then(data => {
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

// 更新漫画
router.post('/api/comics/updateComics', async (req, res) => {
    console.log(req.body)
    let obj = {
        ...req.body,
        updateTime: moment().format()
    }
    console.log(obj)
    comicsCollection.updateOne({ _id: req.body._id }, obj).then(data => {
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


// search
router.get('/api/comics/search', async (req, res) => {
    console.log(req.query)
    try {
        let keyword = req.query.searchKey
        const decodedData = decodeURIComponent(keyword);
        // 构建查询条件，这里使用正则表达式进行模糊匹配
        const query = { name: { $regex: decodedData, $options: 'i' } };
        const searchData = await comicsCollection.find(query).select({ __v: 0, createTime: 0, updateTime: 0 })
        const total = searchData.length
        if (searchData.length > 0) {
            res.json({ code: 200, msg: '查询成功', data: searchData, total: total });
        } else {
            res.json({ code: 200, data: searchData, msg: '没有符合的条件' });
        }

    } catch (error) {
        res.status(500).json({ code: 500, msg: 'An error occurred' });
    }
})



// 添加章节
router.post('/api/comics/addchapter', async (req, res) => {
    console.log(req.body)
    try {
        const { comicsId, order, chapterName } = req.body;
        const yourDate = '2023-06-07 12:00:00'; // 你的日期时间
        const yourTimeZone = 'Asia/Shanghai'; // 你的时区
        const newChapter = {
            comicsId,
            order,
            chapterName,
            createTime: new Date(),
            updateTime: new Date(),
        };
        const result = await chapterCollection.create(newChapter);
        res.json({ code: 200, data: result });
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "服务器出错了" })
    }
})

// 查询章节
router.get('/api/query/chapter', async (req, res) => {
    console.log(req.query)
    try {
        const id = req.query.cartoon_Id
        const cahpterData = await chapterCollection.find({ comicsId: id })
        const total = await cahpterData.length
        res.json({ code: 200, msg: '查询成功', data: cahpterData, total: total });
    } catch (error) {
        res.status(500).json({ code: 500, msg: 'An error occurred' });
    }
})

// 添加图片
router.post('/api/comics/addchapter/img', async (req, res) => {
    console.log(req.body)
    let body = req.body
    let { chapterId, order, comicsId, url } = req.body
    const newBody = body.map(item => {
        const { comicsId, order, url, chapterId } = item
        return {
            comicsId,
            order,
            chapterId,
            url,
            createTime: new Date(),
            updateTime: new Date(),
        }
    })
    console.log(newBody)
    //  const newChapter = {
    //     comicsId ,
    //     order,
    //     url,
    //     chapterId,
    //     createTime: new Date(),
    //     updateTime: new Date(),
    // };

    chapterIMG.insertMany(newBody).then(data => {
        res.json({
            code: 200,
            msg: '添加成功',
            data: data

        })
    }).catch(error => {
        res.json({
            code: 500,
            msg: '添加失败',
            data: error
        })
    })



})


// 小程序首页数据
router.get('/api/homeData', async (req, res) => {
    try {
        const randomComics = await comicsCollection.aggregate([
            { $sample: { size: 15 } }
        ]);
        const carouselModule = randomComics.slice(0, 3); // 轮播图模块
        const recommendModule = randomComics.slice(4, 9); // 人气推荐模块
        const hotModule = randomComics.slice(9, 15); // 热门模块
        res.json({
            code: 200,
            data: {
                carousel: carouselModule,
                hotAndRecommend: {
                    hot: {
                        title: '热门推荐',
                        data: hotModule
                    },
                    recommend: {
                        title: '人气推荐',
                        data: recommendModule
                    }
                }
            },
            msg: '成功'
        })
    } catch (error) {
        res.status(500).json({ msg: error })
    }
})

// 添加阅读量
router.post('/api/read', async (req, res) => {
    console.log(req.body)
    try {
        const { comicsId } = req.body
        let comic = await comicsCollection.findById(comicsId)
        if (!comic) {
            return res.status(404).json({ message: '漫画不存在' });
        }
        // 增加阅读量
        comic.read += 1;
        // 保存更新后的漫画
        await comic.save();
        return res.status(200).json({ code: 200, msg: '阅读成功' });
    } catch (error) {
        res.status(500).json({ msg: error })
    }

})
// 排行
router.get('/api/queryread', async (req, res) => {
    try {
        // 查询漫画文档，按阅读量降序排序，限制结果数量为10
        const topComics = await comicsCollection.find()
            .sort({ read: -1 })
            .limit(10);
        return res.json({code:200,topComics});

    } catch (error) {
        console.error('获取阅读量排行榜时出错：', error);
        return res.status(500).json({ message: '服务器错误' });
    }

})


module.exports = router;