//导入 mongoose
const mongoose = require('mongoose')
const bookshelfSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    comicsId: { type: mongoose.Schema.Types.ObjectId, ref: 'comics' },
    createTime: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Bookshelf', bookshelfSchema);