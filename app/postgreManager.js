// file:/app/postgreManager.js
'use strict';

const pg = require('pg')
const config = require('../config/config')

function createUser(user, callback) {
	pg.connect(config.postgre.connectURL, function (error, client, done) {
		if (error) {
			// Pass the error to the express error handler
			return callback(error)
		}
		const query = "INSERT INTO users (email, username, password) VALUES ($1, $2, $3);"
		const parameters = [user.email, user.username, user.password]
		client.query(query, parameters, function (error, result) {
			// This done callback signals the pg driver that the connection can be closed or returned to the connection pool
			done()
		
			if (error) {
				// pass the error to the express error handler
				return callback(error)
			} else {
				return callback()
			}	
		})
	}) 
}

function getUserByEmail(email, callback) {
	pg.connect(config.postgre.connectURL, function (error, client, done) {
		if (error) {
			return callback(error)
		}

		const query = `SELECT * FROM users WHERE (email == '${email}');`
		client.query(query, function (error, result) {
			done()

			if (error) {
				return callback(error)
			} else {
				return callback(result)
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
