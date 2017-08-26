// file:/test/users_authentification.js
'use strict';

const chai      = require('chai');
const server    = require('../app/index');
const utils 	= require('./utils');
const seed 		= require('./seed');
const should 	= chai.should();

describe('LOGIN Users', () => {

	// Reset all users before each test (ie. each `it()` block).
	beforeEach((done) => {
		utils.deleteUsersByEmails([seed.first_user.email, seed.second_user.email], function() {
			// Create default user for local test cases
			utils.createUser(seed.first_user, done);
		});
	});

	describe('POST /login - single user', () => {
		it('should log default user in', (done) => {
			// Login default user
			let credentials = { username: seed.first_user.email, password: seed.first_user.password };
			utils.loginUserWithCredentials(credentials, null, function(cookie) {
				done();
			});
		});
	});

	describe('POST /login - incorrect second login', () => {
		it('should not log a user in if already logged in', (done) => {
			// Login default user
			let credentials = { username: seed.first_user.email, password: seed.first_user.password };
			utils.loginUserWithCredentials(credentials, null, function(cookie) {
				utils.loginUserWithCredentialsAndErrorMessage(credentials, "Already logged in", cookie, done);
			});
		});
	});

	describe('POST /login - invalid credentials', () => {
		let data = [
			{ reason: 'wrong password', credentials: { username: seed.first_user.email, password: 'wrong_password' } },
			{ reason: 'username and password', credentials: { username: seed.first_user.username, password: seed.first_user.password } },
			{ reason: 'email and username', credentials: { username: seed.first_user.username, email: seed.first_user.email } },
			{ reason: 'missing password field', credentials: { username: seed.first_user.email } },
			{ reason: 'missing username field', credentials: { password: seed.first_user.password } },
			{ reason: 'no credentials', credentials: { } },
			{ reason: 'unknown user credentials', credentials: { username: seed.second_user.email, password: seed.second_user.password } }
		];

		for (let user of data) {
			it(`should not log user in with ${user.reason} and return an error`, (done) => {
				utils.loginUserWithCredentialsAndErrorMessage(user.credentials, "Invalid credentials", null, done);
			});
		};		
	});

	describe('GET /logout - single user', () => {
		it('should login and logout and login again the default user', (done) => {
			// Login default user
			let credentials = { username: seed.first_user.email, password: seed.first_user.password };
			// First login
			utils.loginUserWithCredentials(credentials, null, function(cookie) {
				// Logout
				utils.logoutUser(cookie, function() {
					// Second login
					utils.loginUserWithCredentials(credentials, null, function(cookie) {
						done();
					});
				});
			});
		});
	});

	describe('GET /logout - without active session', () => {
		it('should not logout twice in a row with same cookie', (done) => {
			// Login default user
			let credentials = { username: seed.first_user.email, password: seed.first_user.password };
			// Login
			utils.loginUserWithCredentials(credentials, null, function(cookie) {
				// First logout
				utils.logoutUser(cookie, function() {
					// Second logout
					utils.logoutUserWithError(cookie, done);
				});
			});
		});

		it('should not logout without cookie', (done) => {
			// Login default user
			let credentials = { username: seed.first_user.email, password: seed.first_user.password };
			// Login
			utils.loginUserWithCredentials(credentials, null, function(cookie) {
				// First logout
				utils.logoutUserWithError(null, done);
			});
		});
	});
});
