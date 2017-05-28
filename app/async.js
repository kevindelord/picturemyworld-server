// /app/async.js
'use strict';

// TODO: do more research about async and Promises.

// Documentation: http://caolan.github.io/async/
// nom install async --save

// Second
const async = require('async')
async.map(['file.md'], fs.stat, function (err, results) {  
    // results is now an array of stats for each file
	console.log(results)
})

// Third
function stats (file) {  
  return new Promise((resolve, reject) => {
    fs.stat(file, (err, data) => {
      if (err) {
        return reject (err)
      }
      resolve(data)
    })
  })
}


Promise.all([stats('file.md', 'ferf')])
.then((data) => console.log(data))
.catch((err) => console.log(err))