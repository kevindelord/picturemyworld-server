// file:/test/authentification.js

const chai      = require('chai');
const chaiHttp  = require('chai-http');
const server    = require('../app/index');
const manager	= require('../app/postgreManager');

let should = chai.should();
let users = [{
				email: 'test@mail.com',
				username: 'alex',
				password: 'superpass'
			}
]

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

// Unit Tests: Users

describe('Users', () => {

	// Reset all users before each test (ie. each `it()` block).
	beforeEach((done) => {
		manager.deleteUserByEmail(users[0].email, function (error, result) {
			should.not.exist(error);
			should.exist(result);
			done();
		});
	});

	describe('/GET users', () => {
		it('should GET no user as DB is empty', (done) => {
			checkNumberOfUsers(0, function() {
				done();
			});
		});
	});

	describe('/POST users', () => {
		it('should POST a new user', (done) => {
			createUser(users[0], function() {
				// should GET only 1 user
				checkNumberOfUsers(1, function() {
					done();
				});
			});
		});
	});

	describe('/POST same users again', () => {
		it('should GET no user as DB has been reset before test', (done) => {
			checkNumberOfUsers(0, function() {
				done();
			});
		});

		it('should POST the same user twice and returns an error', (done) => {
			createUser(users[0], function() {
				// POST the same user again and check the error.
				chai.request(server)
					.post('/users')
					.set('content-type', 'application/x-www-form-urlencoded')
					.send(users[0])
					.end((error, response) => {
						should.exist(error);
						should.exist(response);
						error.should.have.status(400);
						response.should.have.status(400);
						response.should.be.json;
						response.body.should.have.property('message').equal('ERROR: Email already taken');
						done();
				});
			});
		});
	});
});