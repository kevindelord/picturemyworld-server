// file:/app/users/init.js
'use strict';

const bcrypt 	= require('bcryptjs');
const manager 	= require('../postgreManager');
const config 	= require('config');
const passport 	= require('passport');
const validator = require('validator');

function _uncatchError(error, response) {
	console.log(error);
	return response.status(500).json({"status": 500, "message": `ERROR ${error.code}: ${error}`}); // Unkown error
};

function _getUserWithIdentifier(identifier, response) {
	if (validator.isUUID(identifier) == false) {
		return response.status(400).json({"status": 400, "message": "Invalid user identifier"});
	}

	manager.getUserByIdentifier(identifier, function(error, result) {
		if (error) {
			return _uncatchError(error, response);
		}

		const user = result[0]
		if (!user) {
			return response.status(400).json({"status": 400, "message": "Invalid user identifier"});
		} else {
			return response.status(200).json({"status": 200, "user": user});
		}
	});
};

function createUser(request, response) {
	const user = request.body;
	if (!user.email || !user.password || !user.username) {
		return response.status(400).json({"status": 400, "message": "ERROR: Missing parameter"});
	}

	if (!validator.isEmail(user.email)) {
		return response.status(400).json({"status": 400, "message": "ERROR: Invalid email"});
	}

	bcrypt.hash(user.password, config.get("bcrypt.seedLength"), function(error, hash) {
		if (error) {
			// Pass the error to the express error handler
			return _uncatchError(error, response);
		} else {
			user.password = hash;
			manager.createUser(user, function(error) {
				if (error) {
					if (error.code == 23505) { // duplicate key value violates unique constraint
						return response.status(400).json({"status": 400, "message": "ERROR: Email already taken"});
					} else {
						return _uncatchError(error, response);
					}
				} else {
					return response.status(200).json({"status": 200, "message": "successfully registered"});
				}
			});
		}
	});
};

function getUsers(request, response) {
	manager.getUsers(function(error, result) {
		if (error) {
			return _uncatchError(error, response);
		} else {
			return response.status(200).json({"status": 200, "users": result});
		}
	});
};

function getUser(request, response) {
	const user_identifier = request.params.user_id;
	_getUserWithIdentifier(user_identifier, response);
};

function getCurrentUser(request, response) {
	const user_identifier = request.session.passport['user'];
	_getUserWithIdentifier(user_identifier, response);
};

function initUsers (app) {
	// POST to create a new user.
	app.post('/users', createUser);
	// GET the list of all users.
	app.get('/users', getUsers);
	// GET the information of the current user.
	app.get('/user', passport.activeSessionRequired(), getCurrentUser);
	// GET the information of a user.
	app.get('/user/:user_id', getUser);
}

module.exports = initUsers;
