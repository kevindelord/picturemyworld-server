// file:/test/users_login.js
'use strict';

const utils 	= require('./utils');
const seed 		= require('./seed');

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
			utils.loginUser(credentials, null, function(cookie, user) {
				done();
			});
		});
	});

	describe('POST /login - incorrect second login', () => {
		it('should not log a user in if already logged in', (done) => {
			// Login default user
			let credentials = { username: seed.first_user.email, password: seed.first_user.password };
			utils.loginUser(credentials, null, function(cookie, user) {
				utils.loginUserWithErrorMessage(credentials, "Already logged in", cookie, done);
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
				utils.loginUserWithErrorMessage(user.credentials, "Invalid credentials", null, done);
			});
		};
	});
});
