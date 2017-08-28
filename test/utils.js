// file:/test/utils.js
'use strict';

const chai      = require('chai');
const server    = require('../app/index');
const manager	= require('../app/postgreManager');
const supertest	= require('supertest');
const should 	= chai.should();
const request 	= supertest(server);

//
// Direct access to database
//

function deleteUsersByEmails(emails, callback) {
	manager.deleteUsersByEmails(emails, function(error, result) {
		should.not.exist(error);
		should.exist(result);
		callback();
	});
};

function deleteAllPostsForUserEmail(email, callback) {
	manager.deleteAllPostsForUserEmail(email, function(error, result) {
		should.not.exist(error);
		should.exist(result);
		callback();
	});
};

//
// API requests
//

// User creation

function checkNumberOfUsers(number, callback) {
	request
		.get('/users')
		.expect('Content-Type', /json/)
		.expect(200)
		.end(function(error, response) {
			should.not.exist(error);
			should.exist(response);
			response.body.should.have.property('status').equal(200);
			response.body.should.have.property('users');
			response.body.users.should.be.a('array');
			response.body.users.should.have.lengthOf(number);
			callback();
	});
};

function createUser(user, callback) {
	_createUser(user, 200, 'successfully registered', callback);
};

function createUserWithErrorMessage(user, message, callback) {
	_createUser(user, 400, message, callback);
};

function _createUser(user, code, message, callback) {
	request
		.post('/users')
		.set('content-type', 'application/x-www-form-urlencoded')
		.send(user)
		.expect('Content-Type', /json/)
		.expect(code)
		.end(function(error, response) {
			should.not.exist(error);
			should.exist(response);
			response.body.should.have.property('status').equal(code);
			response.body.should.have.property('message').equal(message)
			callback();
	});
};

function createUserAndPost(user, post, image, callback) {
	// Create first user account
	createUser(user, function() {
		// Login with first user account
		let credentials = { username: user.email, password: user.password };
		loginUser(credentials, null, function(cookie) {
			createImagePost(post, image, cookie, function() {
				logoutUser(cookie, callback);
			});
		});
	});
}

// Authentification

function getCookie(response) {
	return response.headers['set-cookie'].map(function(r) {
		return r.replace("; path=/; httponly","")
    }).join("; ");
};

// Login

function loginUser(credentials, cookie, callback) {
	_login(credentials, 200, 'success', cookie, callback);
};

function loginUserWithErrorMessage(credentials, message, cookie, callback) {
	_login(credentials, 401, message, cookie, callback);
};

function _login(credentials, code, message, cookie, callback) {
	request
		.post('/login')
		.set('Cookie', cookie)
		.set('content-type', 'application/x-www-form-urlencoded')
		.send(credentials)
		.expect('Content-Type', /json/)
		.expect(code)
		.end(function(error, response) {
			should.not.exist(error);
			should.exist(response);
			response.body.should.have.property('status').equal(code);
			response.body.should.have.property('message').equal(message);
			if (code == 200) {
				callback(getCookie(response));
			} else {
				callback();
			}
	});
};

// Logout

function logoutUser(cookie, callback) {
	_logout(cookie, 200, 'successfully logged out', callback);
};

function logoutUserWithError(cookie, callback) {
	_logout(cookie, 403, 'Unauthorized', callback);
};

function _logout(cookie, code, message, callback) {
	request
		.get('/logout')
		.set('Cookie', cookie)
		.expect('Content-Type', /json/)
		.expect(code)
		.end(function(error, response) {
			should.not.exist(error);
			should.exist(response);
			response.body.should.have.property('status').equal(code);
			response.body.should.have.property('message').equal(message);
			callback();
	});
};

// Image Post

function createImagePost(json, imagePath, cookie, callback) {
	_createImagePost(json, imagePath, cookie, 200, 'New post successfully created', callback);
};

function createImagePostWithError(json, imagePath, cookie, errorCode, errorMessage, callback) {
	_createImagePost(json, imagePath, cookie, errorCode, errorMessage, callback);
};

function _createImagePost(json, imagePath, cookie, errorCode, errorMessage, callback) {
	var req = request.post('/post').set('Cookie', cookie)
	for (var key in json) {
		if (json.hasOwnProperty(key) && json[key]) {
			req.field(key, json[key]);
		}
	};

	req
		.attach('image', imagePath)
		.expect('Content-Type', /json/)
		.expect(errorCode)
		.end(function(error, response) {
			should.not.exist(error);
			should.exist(response);
			response.body.should.have.property('status').equal(errorCode);
			response.body.should.have.property('message').equal(errorMessage);
			callback();
	});
};

function getAllImagePosts(expectedNumber, cookie, callback) {
	request
		.get('/posts')
		.set('Cookie', cookie)
		.expect('Content-Type', /json/)
		.expect(200)
		.end(function(error, response) {
			should.not.exist(error);
			should.exist(response);
			response.body.should.not.have.property('status');
			response.body.should.be.a('array').and.have.lengthOf(expectedNumber);
			callback(response.body);
	});
};

function getImagePostForIdentifier(identifier, cookie, callback) {
	request
		.get('/post/' + identifier)
		.set('Cookie', cookie)
		.expect('Content-Type', /json/)
		.expect(200)
		.end(function(error, response) {
			should.not.exist(error);
			should.exist(response);
			response.body.should.not.have.property('status');
			response.body.should.be.a('array');
			callback(response.body);
	});
};

function getImagePostForIdentifierWithError(identifier, cookie, errorCode, errorMessage, callback) {
	request
		.get('/post/' + identifier)
		.set('Cookie', cookie)
		.expect('Content-Type', /json/)
		.expect(errorCode)
		.end(function(error, response) {
			should.not.exist(error);
			should.exist(response);
			response.body.should.have.property('status').equal(errorCode);
			response.body.should.have.property('message').equal(errorMessage);
			callback();
	});
};

//
// Module exports
//

module.exports.createImagePost = createImagePost;
module.exports.deleteAllPostsForUserEmail = deleteAllPostsForUserEmail;
module.exports.loginUserWithErrorMessage = loginUserWithErrorMessage;
module.exports.loginUser = loginUser;
module.exports.createUserWithErrorMessage = createUserWithErrorMessage;
module.exports.checkNumberOfUsers = checkNumberOfUsers;
module.exports.createUser = createUser;
module.exports.logoutUser = logoutUser;
module.exports.logoutUserWithError = logoutUserWithError;
module.exports.deleteUsersByEmails = deleteUsersByEmails;
module.exports.createImagePostWithError = createImagePostWithError;
module.exports.getAllImagePosts = getAllImagePosts;
module.exports.createUserAndPost = createUserAndPost;
module.exports.getImagePostForIdentifier = getImagePostForIdentifier;
module.exports.getImagePostForIdentifierWithError = getImagePostForIdentifierWithError;
