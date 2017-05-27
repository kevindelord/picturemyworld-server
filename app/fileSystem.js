// app/fs.js

// First example
const fs = require('fs')

function readFile() {
	console.log('start reading a file...')
	fs.readFile('src/file.md', 'utf-8', function (err, content) {  
  		if (err) {
			console.log('error happened during reading the file')
			return console.log(err)
		}
		console.log(content)
		console.log('end of the file')  
	})
}

module.exports.readFile = readFile

// FILE: app/index.js
// const _fs = require('./fileSystem')  
// _fs.readFile()
