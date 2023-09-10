//导入 mongoose
const mongoose = require('mongoose')
let ChapterIMGSchema = new mongoose.Schema({
    comicsId: {
        type: String,
        required: true
    },
    chapterId: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        required: true
    },
    url:{
        type: String,
        required: true
    },
    createTime: {
        type: Date,
        required: true,
        
    },
    updateTime: {
        type: Date,
        required: true,
    },
})

// 创建文档模型
let ChapterIMGModel = mongoose.model('comics_imgs', ChapterIMGSchema)

// 暴露模型
module.exports = ChapterIMGModel;