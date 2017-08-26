// file:/test/utils.js
'use strict';

const chai      = require('chai');
const server    = require('../app/index');
const manager	= require('../app/postgreManager');
const supertest	= require('supertest');
const should 	= chai.should();
const request 	= supertest(server);

// Direct access to database

function deleteUsersByEmails(emails, callback) {
	manager.deleteUsersByEmails(emails, function(error, result) {
		should.not.exist(error);
		should.exist(result);
		callback();
	});
};

function deleteAllPostsForUser(user, callback) {
	manager.deleteAllPostsForUser(user, function(error, result) {
		should.not.exist(error);
		should.exist(result);
		callback();
	});
};

// API requests

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
	request
		.post('/users')
		.set('content-type', 'application/x-www-form-urlencoded')
		.send(user)
		.expect('Content-Type', /json/)
		.expect(200)
		.end(function(error, response) {
			should.not.exist(error);
			should.exist(response);
			response.body.should.have.property('status').equal(200);
			response.body.should.have.property('message').equal('successfully registered')
			callback();	
	});
};

function createUserWithErrorMessage(user, message, callback) {
	request
		.post('/users')
		.set('content-type', 'application/x-www-form-urlencoded')
		.send(user)
		.expect('Content-Type', /json/)
		.expect(400)
		.end(function(error, response) {
			should.not.exist(error);
			should.exist(response);
			response.body.should.have.property('status').equal(400);
			response.body.should.have.property('message').equal(message);
			callback();
	});
};

function getCookie(response) {
	return response.headers['set-cookie'].map(function(r) {
		return r.replace("; path=/; httponly","") 
    }).join("; ");
};

function loginUser(credentials, cookie, callback) {
	request
		.post('/login')
		.set('Cookie', cookie)
		.set('content-type', 'application/x-www-form-urlencoded')
		.send(credentials)
		.expect('Content-Type', /json/)
		.expect(200)
		.end(function(error, response) {
			should.not.exist(error);
			should.exist(response);
			response.body.should.have.property('status').equal(200);
			response.body.should.have.property('message').equal('success');
			callback(getCookie(response));
	});
};

function loginUserWithErrorMessage(credentials, message, cookie, callback) {
	request
		.post('/login')
		.set('Cookie', cookie)
		.set('content-type', 'application/x-www-form-urlencoded')
		.send(credentials)
		.expect('Content-Type', /json/)
		.expect(401)
		.end(function(error, response) {
			should.not.exist(error);
			should.exist(response);
			response.body.should.have.property('status').equal(401);
			response.body.should.have.property('message').equal(message);
			callback();
	});
};

function logoutUser(cookie, callback) {
	request
		.get('/logout')
		.set('Cookie', cookie)
		.expect('Content-Type', /json/)
		.expect(200)
		.end(function(error, response) {
			should.not.exist(error);
			should.exist(response);
			response.body.should.have.property('status').equal(200);
			response.body.should.have.property('message').equal('successfully logged out');
			callback();
	});
};

function logoutUserWithError(cookie, callback) {
	request
		.get('/logout')
		.set('Cookie', cookie)
		.expect('Content-Type', /json/)
		.expect(403)
		.end(function(error, response) {
			should.not.exist(error);
			should.exist(response);
			response.body.should.have.property('status').equal(403);
			response.body.should.have.property('message').equal('Unauthorized');
			callback();
	});
};

function createImagePost(json, imagePath, cookie, callback) {
	request
		.post('/post')
		.set('Cookie', cookie)
        .field('title', json.title)
        .field('description', json.description)
        .field('ratio', json.ratio)
        .field('location', json.location)
        .field('lat', json.lat)
        .field('lng', json.lng)
        .field('date', json.date)
        .attach('image', imagePath)
		.expect('Content-Type', /json/)
		.expect(200)
		.end(function(error, response) {
			should.not.exist(error);
			should.exist(response);
			response.body.should.have.property('status').equal(200);
			response.body.should.have.property('message').equal('New post successfully created');
			callback();
	});
};

// Module exports

module.exports.createImagePost = createImagePost;
module.exports.deleteAllPostsForUser = deleteAllPostsForUser;
module.exports.loginUserWithErrorMessage = loginUserWithErrorMessage;
module.exports.loginUser = loginUser;
module.exports.createUserWithErrorMessage = createUserWithErrorMessage;
module.exports.checkNumberOfUsers = checkNumberOfUsers;
module.exports.createUser = createUser;
module.exports.logoutUser = logoutUser;
module.exports.logoutUserWithError = logoutUserWithError;
module.exports.deleteUsersByEmails = deleteUsersByEmails;
