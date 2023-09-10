//导入 mongoose
const mongoose = require('mongoose')
let ChapterSchema = new mongoose.Schema({
    comicsId: {
        type: String,
        required: true
    },
    chapterName: {
        type: String,
        required: true
    },
    order: {
        type: Number,
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
let ChapterModel = mongoose.model('chapters', ChapterSchema)

// 暴露模型
module.exports = ChapterModel;