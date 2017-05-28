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

function connect(url, next) {
	pg.connect(url, function (error, client, done) {
		if (error) {
			console.log(`ERROR: ${error}`)
			process.exit(1)
		} else {
			next(client, done)
		}
	})
}


function executeQuery(client, query, next) {
	executeQueries(client, [query], 0, next)
}

function executeQueries(client, queries, index, next) {
	if (index >= queries.length) {
		return next(client)
	}

	client.query(queries[index], function (error, result) {
		if (error) {
			console.log(`ERROR: ${error}`)
			process.exit(1)
		} else {
			executeQueries(client, queries, index + 1, next)
		}
	})
}

module.exports.executeQuery = executeQuery
module.exports.executeQueries = executeQueries
module.exports.connect = connect
module.exports.createUser = createUser
module.exports.getUsers = getUsers
module.exports.getPosts = getPosts
