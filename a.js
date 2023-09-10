const fs = require('fs')
fs.readFileSync('./views/index.html','utf8',(err, data)=>{
    if (err) {
        console.error(err);
      } else {
        console.log(data);
      }
})