// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// // router.get('/', function(req, res, next) {
// //   res.render('index', { title: 'Express' });
// // });
// const fs = require('fs')
// const path = require('path');

// router.get('/readFile', function (req, res, next) {
//   try {
//     const filePath = path.join(__dirname, '../views','dist', 'index.html');
//     console.log(filePath)
//     const html = fs.readFileSync(filePath, 'utf8');
//     res.setHeader('Content-Type', 'text/html');
//     res.setHeader('Content-Type', 'text/css');
//     res.setHeader('Content-Type', 'application/javascript');
//     res.send(html)
//   } catch (error) {
//     console.log(error)
//   }
// });






module.exports = router;
