// file:/test/utils.js
'use strict';

const chai      = require('chai');
const server    = require('../app/index');

let should = chai.should();

function checkNumberOfUsers(number, callback) {
	chai.request(server).get('/users').end((error, response) => {
		should.not.exist(error);
		should.exist(response);
		response.should.have.status(200);
		response.should.be.json;
		response.body.should.have.property('users');
		response.body.users.should.be.a('array');
		response.body.users.should.have.lengthOf(number);
		callback();
	});
};

function createUser(user, callback) {
	chai.request(server)
		.post('/users')
		.set('content-type', 'application/x-www-form-urlencoded')
		.send(user)
		.end((error, response) => {
			should.not.exist(error);
			should.exist(response);
			response.should.have.status(200);
			response.should.be.json;
			response.body.should.have.property('message');
			response.body.message.should.equal('successfully registered')
			callback();	
	});
};

function createUserWithErrorMessage(user, message, callback) {
	chai.request(server)
		.post('/users')
		.set('content-type', 'application/x-www-form-urlencoded')
		.send(user)
		.end((error, response) => {
			should.exist(error);
			should.exist(response);
			error.should.have.status(400);
			response.should.have.status(400);
			response.should.be.json;
			response.body.should.have.property('message').equal(message);
			callback();
	});
};

function getCookie(response) {
	return response.headers['set-cookie'].map(function(r) {
		return r.replace("; path=/; httponly","") 
    }).join("; ");
}

function loginUserWithCredentials(credentials, cookie, callback) {
	chai.request(server)
		.post('/login')
		.set('Cookie', cookie)
		.set('content-type', 'application/x-www-form-urlencoded')
		.send(credentials)
		.end((error, response) => {
			should.not.exist(error);
			should.exist(response);
			response.should.have.status(200);
			response.should.be.json;
			response.body.should.have.property('message').equal('success');
			callback(getCookie(response));
	});
}

function loginUserWithCredentialsAndErrorMessage(credentials, message, cookie, callback) {
	chai.request(server)
		.post('/login')
		.set('Cookie', cookie)
		.set('content-type', 'application/x-www-form-urlencoded')
		.send(credentials)
		.end((error, response) => {
			should.exist(error);
			should.exist(response);
			error.should.have.status(401);
			response.should.have.status(401);
			response.should.be.json;
			response.body.should.have.property('message').equal(message);
			callback();
	});
};

function logoutUser(cookie, callback) {
	chai.request(server)
		.get('/logout')
		.set('Cookie', cookie)
		.end((error, response) => {
			should.not.exist(error);
			should.exist(response);
			response.should.have.status(200);
			response.should.be.json;
			response.body.should.have.property('message').equal("successfully logged out");
			callback();
	});
};

function logoutUserWithError(cookie, callback) {
	chai.request(server)
		.get('/logout')
		.set('Cookie', cookie)
		.end((error, response) => {
			should.exist(error);
			should.exist(response);
			error.should.have.status(403);
			response.should.have.status(403);
			response.should.be.json;
			response.body.should.have.property('message').equal('Unauthorized');
			callback();
	});
};

module.exports.loginUserWithCredentialsAndErrorMessage = loginUserWithCredentialsAndErrorMessage;
module.exports.loginUserWithCredentials = loginUserWithCredentials;
module.exports.createUserWithErrorMessage = createUserWithErrorMessage;
module.exports.checkNumberOfUsers = checkNumberOfUsers;
module.exports.createUser = createUser;
module.exports.logoutUser = logoutUser;
module.exports.logoutUserWithError = logoutUserWithError;
