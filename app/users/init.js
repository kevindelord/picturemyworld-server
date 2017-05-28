// file:/app/users/init.js
'use strict';

// const config = require('../../config/config')
const bcrypt = require('bcryptjs');
const manager = require('../postgreManager')
const config = require('../../config/config')

function createUser(request, response) {
	const user = request.body
	bcrypt.hash(user.password, config.bcrypt.seendLength, function(error, hash) {
		if (error) {
			// Pass the error to the express error handler
			return response.status(500).send(`ERROR: ${error}`)
		} else {
			user.password = hash
			console.log(user)
			manager.createUser(user, function (error) {
				if (error) {
					return response.status(500).send(`ERROR: ${error}`)
				} else {
					return response.status(200).send('successfully registered')
				}
			})
		}
	});
}

function initUsers (app) {
	console.log("init users endpoints")
	app.post('/users', createUser)
	// app.get('/users', getUsers)
}

module.exports = initUsers

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

// function getUsers(request, response) {
// 	pg.connect(config.postgre.connectURL, function (error, client, done) {
// 		if (error) {
// 			return response.status(500).send(`ERROR: ${error}`)
// 		}

// 		client.query("SELECT * FROM users", function (error, result) {
// 			done()

// 			if (error) {
// 				return response.status(500).send(`ERROR: ${error}`)
// 			} else {
// 				return response.json(result.rows)
// 			}
// 		})
// 	})
// }