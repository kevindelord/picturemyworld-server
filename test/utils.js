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
}

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
}

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
}

module.exports.createUserWithErrorMessage = createUserWithErrorMessage;
module.exports.checkNumberOfUsers = checkNumberOfUsers
module.exports.createUser = createUser
