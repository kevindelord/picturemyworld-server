// file:/app/postgreManager.js
'use strict';

const pg = require('pg')
const config = require('../config/config')

// Create a new user with a prepared statement. 
function createUser(user, callback) {
	const query = {
		name: 'create-user',
		text: 'INSERT INTO users (email, username, password) VALUES ($1, $2, $3)',
		values: [user.email, user.username, user.password]
	}
	executeQueryWithParameters(query, callback)
}

// Fetch a user by its email (unique in DB) with a prepared statement.
function getUserByEmail(email, callback) {
	const query = {
		name: 'get-user-by-email',
		text: 'SELECT id, password FROM users WHERE (email = $1)',
		values: [email]
	}
	executeQueryWithParameters(query, callback)
}

// Fetch all users with a prepared statement.
function getUsers(callback) {
	const query = {
		name: 'get-users',
		text: 'SELECT (email, username, created_at, updated_at) FROM users',
		values: []
	}
	executeQueryWithParameters(query, callback)
}

// Fetch all posts with a prepared statement.
function getPosts(callback) {
	const query = {
		name: 'get-posts',
		text: 'SELECT (title, description, location, lat, lng, date, ratio, created_at, updated_at) FROM posts',
		values: []
	}
	executeQueryWithParameters(query, callback)
}

// Create a new post with a prepared statement. 
function createPost(post, callback) {
	const query = {
		name: 'create-post',
		text: 'INSERT INTO posts (title, description, location, lat, lng, date, ratio, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);',
		values: [post.title, post.description, post.location, post.lat, post.lng, post.date, post.ratio, post.user_id]
	}
	executeQueryWithParameters(query, callback)
}

// Execute a query with a prepared statement.
function executeQueryWithParameters(query, callback) {
	// Connect to the database using the configured username, host and database name.
	pg.connect(config.postgre.connectURL, function (error, client, done) {
		if (error) {
			return callback(error)
		}
		// Execute the query.
		client.query(query, function (error, result) {
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

module.exports.createPost = createPost
module.exports.createUser = createUser
module.exports.getUsers = getUsers
module.exports.getPosts = getPosts
module.exports.getUserByEmail = getUserByEmail
