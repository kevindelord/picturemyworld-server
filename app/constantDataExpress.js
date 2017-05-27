// /app/databaseExpress.js

const path = require('path')  
const express = require('express')  
const exphbs = require('express-handlebars')
const port = 3000
const bodyParser = require('body-parser')

const users = []
const app = express()

// Documentation: https://www.npmjs.com/package/body-parser
// Use BodyParser to parse the body of a request
app.use(bodyParser.urlencoded({extended: false}));
  
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

app.post('/users', function (req, res) {  
    // retrieve user posted data from the body
    const user = req.body
    users.push({ name: user.name, age: user.age })
    res.send('successfully registered')
    console.log(users)
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