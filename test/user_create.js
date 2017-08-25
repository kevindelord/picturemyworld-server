// file:/test/user_create.js

const chai      = require('chai');
const chaiHttp  = require('chai-http');
const server    = require('../app/index');
const manager	= require('../app/postgreManager');

let should = chai.should();

let seed = {
	normal_user: {
		email: 'test@mail.com',
		username: 'alex',
		password: 'superpass'
	},
	user_with_missing_email: {
		username: 'alex',
		password: 'superpass'
	},
	user_with_missing_password: {
		email: 'test@mail.com',
		username: 'alex',
	},
	user_with_missing_username: {
		email: 'test@mail.com',
		password: 'superpass'
	},
	user_with_empty_password: {
		email: 'test@mail.com',
		username: 'alex',
		password: ''
	},
	user_with_empty_username: {
		email: 'test@mail.com',
		username: '',
		password: 'superpass'
	},
	user_with_empty_email: {
		email: '',
		username: 'superpass',
		password: 'superpass'
	},
	user_with_invalid_email: {
		email: 'this is not an email',
		username: 'superpass',
		password: 'superpass'
	},
};

chai.use(chaiHttp);

// Utils functions

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

// Unit Tests: Users

describe('Users', () => {

	// Reset all users before each test (ie. each `it()` block).
	beforeEach((done) => {
		manager.deleteUserByEmail(seed.normal_user.email, function (error, result) {
			should.not.exist(error);
			should.exist(result);
			done();
		});
	});

	describe('/POST users', () => {
		it('should POST a new user and GET its info', (done) => {
			createUser(seed.normal_user, function() {
				// should GET only 1 user
				checkNumberOfUsers(1, function() {
					done();
				});
			});
		});
	});

	describe('/GET users', () => {
		it('should GET no user as DB is empty', (done) => {
			checkNumberOfUsers(0, function() {
				done();
			});
		});
	});

	describe('/POST existing user', () => {
		it('should POST the same user twice and returns an error', (done) => {
			createUser(seed.normal_user, function() {
				// POST the same user again and check the error.
				createUserWithErrorMessage(seed.normal_user, 'ERROR: Email already taken', function() {
					done();
				});
			});
		});
	});

	describe('/POST invalid users', () => {
		let data = [
			{ json: seed.user_with_missing_email, reason: 'missing email', message: 'ERROR: Missing parameter' },
			{ json: seed.user_with_missing_password, reason: 'missing password', message: 'ERROR: Missing parameter' },
			{ json: seed.user_with_missing_username, reason: 'missing username', message: 'ERROR: Missing parameter' },
			{ json: seed.user_with_empty_password, reason: 'empty password', message: 'ERROR: Missing parameter' },
			{ json: seed.user_with_empty_username, reason: 'empty username', message: 'ERROR: Missing parameter' },
			{ json: seed.user_with_empty_email, reason: 'empty email', message: 'ERROR: Missing parameter' },
			{ json: seed.user_with_invalid_email, reason: 'invalid email', message: 'ERROR: Invalid email' }
		]
		for (let user of data) {
			it(`should POST invalid user with ${user.reason} and returns an error`, (done) => {
				createUserWithErrorMessage(user.json, user.message, function() {
					done();
				});
			});
		};
	});
});
