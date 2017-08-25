// file:/app/user/init.js
'use strict';

const passport = require('passport');

function loginUser(request, response) {
	passport.authenticate('local', function(error, user) {
		if (error) {
			return response.status(500).json({"status": 500, "message": `ERROR ${error.code}: ${error}`}); // Unknown error
		}
		// Invalid credentials or request
		if (!user) {
			return response.status(401).json({"status": 401, "message": "Invalid credentials"});
		}
		// Only in case of success
		return response.status(200).json({"status": 200, "message": "success"});
	})(request, response);
};

function logout(request, response) {
	request.logout();
	return response.status(200).json({"status": 200, "message": "successfully logged out"});
};

function initUser (app) {
	app.post('/login', passport.emptySessionRequired(), loginUser);
	app.get('/logout', logout);
}

module.exports = initUser
