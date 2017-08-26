// file:/app/user/init.js
'use strict';

const passport = require('passport');

function loginUser(request, response) {
	if (request.isAuthenticated()) {
		// Check if the user is not already logged in.
		return response.status(401).json({"status": 401, "message": "Already logged in"});
	}

	passport.authenticate('local', function(error, user) {
		if (error) {
			return response.status(500).json({"status": 500, "message": `ERROR ${error.code}: ${error}`}); // Unknown error
		}

		if (!user) {
			// Invalid credentials or request
			return response.status(401).json({"status": 401, "message": "Invalid credentials"});
		}
		request.logIn(user, function(error) {
			if (error) {
				return response.status(500).json({"status": 500, "message": `ERROR ${error.code}: ${error}`}); // Unknown error
			}

			// Only in case of success
			return response.status(200).json({"status": 200, "message": "success"});
		});
	})(request, response);
};

function logout(request, response) {
	request.logout();
	return response.status(200).json({"status": 200, "message": "successfully logged out"});
};

function initUser(app) {
	app.post('/login', loginUser);
	app.get('/logout', passport.activeSessionRequired(), logout);
}

module.exports = initUser;
