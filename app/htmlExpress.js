// /app/htmlExpress.js

const path = require('path')  
const express = require('express')  
const exphbs = require('express-handlebars')
const port = 3000

const app = express()

// Documentation: https://www.npmjs.com/package/express-handlebars
app.engine('.hbs', exphbs({  
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts')
}))
app.set('view engine', '.hbs')  
app.set('views', path.join(__dirname, 'views'))

app.get('/', (request, response) => {  
    response.render('home', {
        name: 'Test Kevin'
    })
})

function start () {

	app.listen(port, (err) => {  
    	if (err) {
        	return console.log('something bad happened', err)
        	}
    	console.log(`server is listening on ${port}`)
	})
}

module.exports.start = start
