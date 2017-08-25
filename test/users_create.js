// file:/test/users_create.js
'use strict';

const chai      = require('chai');
const chaiHttp  = require('chai-http');
const server    = require('../app/index');
const manager	= require('../app/postgreManager');
const utils 	= require('./utils');
const seed 		= require('./seed');

let should = chai.should();

chai.use(chaiHttp);

describe('CREATE Users', () => {

	// Reset all users before each test (ie. each `it()` block).
	beforeEach((done) => {
		manager.deleteUsersByEmails([seed.first_user.email], function (error, result) {
			should.not.exist(error);
			should.exist(result);
			done();
		});
	});

	describe('POST /users - single user', () => {
		it('should POST a new user and GET its info', (done) => {
			utils.createUser(seed.first_user, function() {
				// should GET only 1 user
				utils.checkNumberOfUsers(1, function() {
					done();
				});
			});
		});
	});

	describe('POST /users - existing user', () => {
		it('should POST the same user twice and returns an error', (done) => {
			utils.createUser(seed.first_user, function() {
				// POST the same user again and check the error.
				utils.createUserWithErrorMessage(seed.first_user, 'ERROR: Email already taken', function() {
					done();
				});
			});
		});
	});

	describe('POST /users - invalid users', () => {
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
			it(`should POST invalid user with ${user.reason} and return an error`, (done) => {
				utils.createUserWithErrorMessage(user.json, user.message, function() {
					done();
				});
			});
		};
	});
});
