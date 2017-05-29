// file:/app/views/init.js
'use strict';

const path = require('path')
const exphbs = require('express-handlebars')

function initViews (app) {

	// Documentation: https://www.npmjs.com/package/express-handlebars
	app.engine('.hbs', exphbs({  
		defaultLayout: 'main',
		extname: '.hbs',
		layoutsDir: path.join(__dirname, './layouts')
	}))
	app.set('view engine', '.hbs')  
	app.set('views', __dirname)

	app.get('/', function (request, response) {
		response.render('welcome')
	})
}

module.exports = initViews
