// file:/app/users/init.js
'use strict';

const bcrypt 	= require('bcryptjs');
const manager 	= require('../postgreManager');
const config 	= require('config');
const passport 	= require('passport');

function createUser(request, response) {
	const user = request.body;
	if (!user.email || !user.password || !user.username) {
		return response.status(400).json({"status": 400, "message": `ERROR: Missing parameter ${user.email}`});
	}

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
			return response.status(200).json({"status": 200, "users": result});
		}
	});
}

function initUsers (app) {
	app.post('/users', createUser);
	app.get('/users', getUsers);
}

module.exports = initUsers;
