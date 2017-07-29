// file:/app/users/init.js
'use strict';

const bcrypt 	= require('bcryptjs');
const manager 	= require('../postgreManager');
const config 	= require('config');
const passport 	= require('passport');

function createUser(request, response) {
	const user = request.body;
	bcrypt.hash(user.password, config.get("bcrypt.seedLength"), function(error, hash) {
		if (error) {
			// Pass the error to the express error handler
			return response.status(500).json({"status": 500, "message": `ERROR: ${error}`});
		} else {
			user.password = hash;
			manager.createUser(user, function (error) {
				if (error) {
					return response.status(500).json({"status": 500, "message": `ERROR: ${error}`});
				} else {
					return response.status(200).json({"status": 200, "message": "successfully registered"});
				}
			});
		}
	});
}

function getUsers(request, response) {
	manager.getUsers(function (error, result) {
		if (error) {
			return response.status(500).json({"status": 500, "message": `ERROR: ${error}`});
		} else {
			return response.json(result);
		}
	});
}

function initUsers (app) {
	app.post('/users', createUser);
	app.get('/users', passport.authenticationMiddleware(), getUsers);
}

module.exports = initUsers;
