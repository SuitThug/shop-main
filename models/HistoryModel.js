
const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    comicsId: { type: mongoose.Schema.Types.ObjectId, ref: 'comics' },
    createdTime: { type: Date, default: Date.now },
    updateTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model('History', historySchema);