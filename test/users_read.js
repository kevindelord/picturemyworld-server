// file:/test/users_get.js
'use strict';

const chai      = require('chai');
const server    = require('../app/index');
const utils 	= require('./utils');
const seed 		= require('./seed');
const should 	= chai.should();
const supertest	= require('supertest');
const request 	= supertest(server);

describe('READ Users', () => {

	// Reset all users before each test (ie. each `it()` block).
	beforeEach((done) => {
		utils.deleteUsersByEmails([seed.first_user.email, seed.second_user.email], done);
	});

	describe('GET /users - empty database', () => {
		it('should GET no user as DB is empty', (done) => {
			utils.checkNumberOfUsers(0, done);
		});
	});

	describe('GET /users - multiple users', () => {
		it('should POST two users', (done) => {
			// create first user
			utils.createUser(seed.first_user, function() {
				// should GET only 1 user
				utils.checkNumberOfUsers(1, function() {
					// create second user
					utils.createUser(seed.second_user, function() {
						// should GET only 2 users
						utils.checkNumberOfUsers(2, done);
					});
				});
			});
		});
	});

	describe('GET /users - create and verify data', () => {
		it('should POST one user and GET valid info', (done) => {
			// create first user
			utils.createUser(seed.first_user, function() {
				// get unique user and check its info
				request
					.get('/users')
					.expect('Content-Type', /json/)
					.expect(200)
					.end(function(error, response) {
						should.not.exist(error);
						should.exist(response);

						response.body.should.have.property('users');
						response.body.users.should.be.a('array');
						response.body.users.should.have.lengthOf(1);
						let user = response.body.users[0]
						user.should.have.all.keys('email', 'username', 'created_at', 'updated_at')
						user.email.should.equal(seed.first_user.email)
						user.username.should.equal(seed.first_user.username)
						user.created_at.should.should.be.string;
						user.updated_at.should.should.be.string;
						// check date format with a regex
						let regex = /\d{4}-[01]\d{1}-[0-3]\d{1}T[0-2]\d{1}:[0-5]\d{1}:[0-5]\d{1}\.\d{3}Z/;
						user.created_at.should.match(regex);
						user.updated_at.should.match(regex);

						done();
				});
			});
		});
	});
});
