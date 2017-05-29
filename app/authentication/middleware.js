// file:/app/authentication/middleware.js
'use strict';

function authenticationMiddleware () {
	return function (request, result, next) {
		if (request.isAuthenticated()) {
			return next()
		} else {
			return result.redirect('/')
		}
	}
}

module.exports = authenticationMiddleware
