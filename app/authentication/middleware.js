// file:/app/authentication/middleware.js
'use strict';

function authenticationRequired () {
	return function (request, response, next) {
		if (request.isAuthenticated()) {
			return next();
		} else {
			return response.status(403).json({"status": 403, "message": "Unauthorized"});
		}
	};
}

function emptySessionRequired () {
	return function (request, response, next) {
		if (request.isAuthenticated()) {
			return response.status(403).json({"status": 403, "message": "Unauthorized"});
		} else {
			return next();
		}
	};
}

module.exports.authenticationRequired = authenticationRequired;
module.exports.emptySessionRequired = emptySessionRequired;
