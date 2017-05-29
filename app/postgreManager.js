// file:/app/postgreManager.js
'use strict';

const pg = require('pg')
const config = require('../config/config')

function createUser(user, callback) {
	const query = "INSERT INTO users (email, username, password) VALUES ($1, $2, $3);"
	const parameters = [user.email, user.username, user.password]
	executeQueryWithParameters(query, parameters, callback)
}

// function getUserByEmail(email, callback) {
// 	pg.connect(config.postgre.connectURL, function (error, client, done) {
// 		if (error) {
// 			return callback(error)
// 		}

// 		const query = `SELECT * FROM users WHERE (email == '${email}');`
// 		client.query(query, function (error, result) {
// 			done()

// 			if (error) {
// 				return callback(error)
// 			} else {
// 				return callback(result)
// 			}
// 		})
// 	})
// }

function getUsers(callback) {
	const query = "SELECT * FROM users"
	executeQueryWithParameters(query, null, callback)
}

function getPosts(callback) {
	const query = "SELECT * FROM posts"
	executeQueryWithParameters(query, null, callback)
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

function executeQueryWithParameters(query, parameters, callback) {
	// Connect to the database using the configured username, host and database name.
	pg.connect(config.postgre.connectURL, function (error, client, done) {
		if (error) {
			return callback(error)
		}
		client.query(query, parameters, function (error, result) {
			// Close the pg client.
			done()
			if (error) {
				return callback(error)
			} else {
				return callback(null, result.rows)
			}
		})
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
