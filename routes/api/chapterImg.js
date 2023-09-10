var express = require('express');
var router = express.Router();
const chapterCollection = require('../../models/ChapterImgModel')

// 获取漫画图片
router.get('/comics/page', async (req, res) => {
    // let ids = eval(req.body.ids);
    console.log(req.query)
    try {
        // const selectId = { __v: 0, createTime: 0, updateTime: 0 }
        let {chapterId,comicsId} = req.query
        //  $and 并且的意思 ，需要满足漫画id与章节id都相等的情况
        let querys = {$and:[{comicsId:comicsId},{chapterId:chapterId}]}
        const result = await chapterCollection.find(querys);
        res.json({ code: 200, msg: "成功", data: result})
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "服务器出错了" })
    }
})






module.exports = router;
