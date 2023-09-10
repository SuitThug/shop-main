//导入 mongoose
const mongoose = require('mongoose')
// 创建文档结构对象
let MenuSchema = new mongoose.Schema({
    rid: { type: Number },
    pid: { type: Number },
    path: { type: String },
    name: { type: String },
    icon: { type: String },
    title: { type: String },
})

// 在模型的预处理钩子中实现自动增长逻辑
MenuSchema.pre('save', async function(next) {
    if (this.isNew) {
      const maxDoc = await this.constructor.findOne({}, {}, { sort: { rid: -1 } });
      if (maxDoc) {
        this.rid = maxDoc.rid + 1;
      } else {
        this.rid = 1;
      }
    }
    next();
  });

// 创建文档模型
let MenuModel = mongoose.model('menus', MenuSchema)

// 暴露模型
module.exports = MenuModel;