// file:/app/authentication/middleware.js
'use strict';

function authenticationMiddleware () {
	return function (request, response, next) {
		if (request.isAuthenticated()) {
			return next()
		} else {
			return response.status(401).json({"status": 401, "message": "Unauthorized"})
		}
	}
}

module.exports = authenticationMiddleware
