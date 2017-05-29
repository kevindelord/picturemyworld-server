// file:/app/users/init.js
'use strict';

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

function getUsers(request, response) {
	manager.getUsers(function (error, result) {
		if (error) {
			return response.status(500).send(`ERROR: ${error}`)
		} else {
			return response.json(result)
		}
	})
}

function initUsers (app) {
	app.post('/users', createUser)
	app.get('/users', getUsers)
}

module.exports = initUsers
