// /app/expressManager.js
'use strict';

const express = require('express')

const port = 3000
const bodyParser = require('body-parser')
const app = express()

// Documentation: https://www.npmjs.com/package/body-parser
// Use BodyParser to parse the body of a request
app.use(bodyParser.urlencoded({extended: true}));

// Init authentication through Passportjs.
require('./authentication').init(app)

// Setup basic html views
require('./views').init(app)

// Setup endpoints.
require('./users').init(app)
require('./posts').init(app)

function start () {
	app.listen(port, (err) => {  
    	if (err) {
        	return console.log('something bad happened', err)
        }
    	console.log(`server is listening on ${port}`)
	})
}

module.exports.start = start
