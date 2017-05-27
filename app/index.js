// /app/index.js

const express = require('express')  
const app = express()  
const port = 3000

app.use((request, response, next) => {  
  console.log(request.headers)
  next()
})

app.use((request, response, next) => {  
  request.chance = Math.random()
  next()
})

app.get('/', (request, response) => {  
	throw new Error('oops')
	// response.send('Hello from Express!')
  	// response.json({
	//   chance: request.chance
	// })
})

// Error handling middleware always at the end.
app.use((err, request, response, next) => {  
  	// log the error, for now just console.log
  	console.log(err)
  	response.status(500).send('Something broke!')
})

app.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`)
})
