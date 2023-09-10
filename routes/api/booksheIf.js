var express = require('express');
var router = express.Router();
var Bookshelf = require('../../models/BookshelfModel')
const comicsCollection = require('../../models/ComicsModel')
// 加入书架
router.post('/addToBookshelf', async (req, res) => {
    const { userId, comicsId } = req.body;
    try {
        const bookshelf = new Bookshelf({ userId, comicsId });
        await bookshelf.save();
        res.status(200).json({ code: 200, msg: '漫画已加入书架' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 移出书架
router.post('/removeFromBookshelf', async (req, res) => {
    const { userId, comicsId } = req.body;
    try {
        await Bookshelf.deleteOne({ userId, comicsId });
        res.json({code:200, msg: '移除收藏' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '服务器错误' });
    }
});
// 查询书架
router.get('/queryBookshelf', async (req, res) => {
    console.log(req.query)
    const { userId } = req.query
    try {
        // 查询书架信息
        let data = await Bookshelf.find({ userId: userId });
        let books = []
        data.forEach(item => {
            books.push(item.comicsId)
        })
        //  根据书架信息查询漫画
        let comics = await comicsCollection.find({ _id: books });

        res.status(200).json({ code: 200, msg: '收藏查询成功', data: comics });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 查看是否已经收藏
router.get('/queryBookshelf/isCollect', async (req, res) => {
    console.log(req.query)
    const { userId, comicsId } = req.query
    try {
        // 查询书架信息
        let books = await Bookshelf.find({ $and: [{ userId: userId }, { comicsId: comicsId }] });
        if (books.length > 0) {
            books.forEach(element => {
                console.log(element.comicsId)
                if (comicsId == element.comicsId) {
                    res.json({ code: 200, msg: '已收藏', isCollect: true })
                }
            });
        } else {
            res.json({ code: 200, msg: '没有收藏', isCollect: false })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '服务器错误' });
    }
});


module.exports = router;