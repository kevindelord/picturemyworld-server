// file:/app/authentication/middleware.js
'use strict';

function activeSessionRequired() {
	return function (request, response, next) {
		if (request.isAuthenticated()) {
			return next();
		} else {
			return response.status(403).json({"status": 403, "message": "Unauthorized"});
		}
	};
}

module.exports.activeSessionRequired = activeSessionRequired;
