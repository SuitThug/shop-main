var express = require('express');
var router = express.Router();
const historyCollection = require('../../models/HistoryModel')
const comicsCollection = require('../../models/ComicsModel')
// 添加历史记录
router.post('/history', async (req, res) => {
    const { userId, comicsId } = req.body;
    try {
        const userHistory = await historyCollection.find({ $and: [{ userId: userId }, { comicsId: comicsId }] }).sort({ createTime: -1 });
        let length = await userHistory.length
        if (length > 0) {
            for (const history of userHistory) {
                const id = history.comicsId.toString(); // 将漫画ID转换为字符串
                const history_id = history._id.toString(); // 将历史记录Id转换为字符串
                if (comicsId == id) {
                    const query = { _id: history_id };
                    const update = { $set: { updateTime: new Date() } }; // 更新操作，$set 表示设置新值
                    let h = await historyCollection.updateOne(query, update, { new: true })
                    if (h.modifiedCount == 1) {
                        res.status(200).json({ code: 200, msg: '更新历史记录时间戳'});
                    } else {
                        res.status(500).json({ code: 500, msg: '更新历史时间戳失败' });
                    }
                }
            }
        } else {
            const bookshelf = new historyCollection({ userId, comicsId });
            await bookshelf.save();
            res.status(200).json({ code: 200, msg: '新增历史记录' });
        }



        // 遍历用户的浏览历史记录

        // console.log(seenComics)



    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '服务器错误' });
    }
})

// 查询历史记录
/**
 * p1:历史记录表
 * p2：漫画表
 * 历史记录表只存储了用户ID和历史记录ID，我想根据历史记录表中的更新时间对漫画进行排序
 */
router.get('/queryHistory', async (req, res) => {
    const { userId } = req.query;
    try {
        let query = await historyCollection.find({ userId: userId }).sort({ updateTime: -1 })
        // 提取历史记录中的漫画ID到一个数组
        const comicIds = query.map(record => record.comicsId);
        let comics = await comicsCollection.find({ _id: { $in: comicIds } }).lean()
        // 对查询到的漫画信息按历史记录的更新时间进行排序
        const sortedComics = query.map(record => {
            const comic = comics.find(c => c._id.equals(record.comicsId));
            return {
                ...comic,
                updateTime: record.updateTime
            };
        }).sort((a, b) => b.updateTime - a.updateTime); // 降序排序

        console.log(sortedComics)

        res.json({ code: 200, data: sortedComics });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '服务器错误' });
    }
})

module.exports = router