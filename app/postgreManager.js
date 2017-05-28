// /app/postgreManager.js

const pg = require('pg')
const config = require('../config/config')

function createUser(request, response) {
	const user = request.body
	pg.connect(config.postgre.connectURL, function (error, client, done) {
		if (error) {
			// Pass the error to the express error handler
			return response.status(500).send(`ERROR: ${error}`)
		}

		client.query("INSERT INTO users (id, email, username) VALUES ($1, $2, $3);", [user.id, user.email, user.username], function (error, result) {
			// This done callback signals the pg driver that the connection can be closed or returned to the connection pool
			done()
		
			if (error) {
				// pass the error to the express error handler
				return response.status(500).send(`ERROR: ${error}`)
			} else {
				return response.status(200).send('successfully registered')
			}	
		})
	}) 
}

function getUsers(request, response) {
	pg.connect(config.postgre.connectURL, function (error, client, done) {
		if (error) {
			return response.status(500).send(`ERROR: ${error}`)
		}

		client.query("SELECT * FROM users", function (error, result) {
			done()

			if (error) {
				return response.status(500).send(`ERROR: ${error}`)
			} else {
				return response.json(result.rows)
			}
		})
	})
}

function getPosts(request, response) {
	pg.connect(config.postgre.connectURL, function (error, client, done) {
		if (error) {
			return response.status(500).send(`ERROR: ${error}`)
		}

		client.query("SELECT * FROM posts", function (error, result) {
			done()

			if (error) {
				return response.status(500).send(`ERROR: ${error}`)
			} else {
				return response.json(result.rows)
			}
		})
	})
}

module.exports.createUser = createUser
module.exports.getUsers = getUsers
module.exports.getPosts = getPosts
