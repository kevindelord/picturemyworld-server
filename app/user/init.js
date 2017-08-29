// file:/app/user/init.js
'use strict';

const passport = require('passport');

function _uncatchError(error, response) {
	console.log(error);
	// TODO: refactor this into ONE common function.
	return response.status(500).json({"status": 500, "message": `ERROR ${error.code}: ${error}`}); // Unkown error
};

function loginUser(request, response) {
	if (request.isAuthenticated()) {
		// Check if the user is not already logged in.
		return response.status(401).json({"status": 401, "message": "Already logged in"});
	}

	passport.authenticate('local', function(error, user) {
		if (error) {
			return _uncatchError(error, response);
		}

		if (!user) {
			// Invalid credentials or request
			return response.status(401).json({"status": 401, "message": "Invalid credentials"});
		}
		request.logIn(user, function(error) {
			if (error) {
				return _uncatchError(error, response);
			}

			// Only in case of success
			return response.status(200).json({"status": 200, "user": user});
		});
	})(request, response);
};

function logout(request, response) {
	request.logout();
	return response.status(200).json({"status": 200, "message": "successfully logged out"});
};

function initUser(app) {
	// POST Login with local authentification.
	app.post('/login', loginUser);
	// GET Logout from local authentification.
	app.get('/logout', passport.activeSessionRequired(), logout);
}

module.exports = initUser;
