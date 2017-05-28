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

	// Default GET request on root
	app.get('/', (request, response) => {  
	    response.render('home', {
	        name: 'Test Kevin'
	    })
	})
}

module.exports = initViews
