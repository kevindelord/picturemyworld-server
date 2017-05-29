// file:/app/postgreManager.js
'use strict';

const pg = require('pg')
const config = require('../config/config')

function createUser(user, callback) {
	const query = "INSERT INTO users (email, username, password) VALUES ($1, $2, $3);"
	const parameters = [user.email, user.username, user.password]
	executeQueryWithParameters(query, parameters, callback)
}

function getUserByEmail(email, callback) {
	const query = `SELECT * FROM users WHERE (email = '${email}');`
	executeQueryWithParameters(query, null, callback)
}

function getUsers(callback) {
	const query = "SELECT * FROM users"
	executeQueryWithParameters(query, null, callback)
}

function getPosts(callback) {
	const query = "SELECT * FROM posts"
	executeQueryWithParameters(query, null, callback)
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

module.exports.createUser = createUser
module.exports.getUsers = getUsers
module.exports.getPosts = getPosts
module.exports.getUserByEmail = getUserByEmail
