// file:/test/users_logout.js
'use strict';

const utils 	= require('./utils');
const seed 		= require('./seed');

describe('LOGOUT Users', () => {

	// Reset all users before each test (ie. each `it()` block).
	beforeEach((done) => {
		utils.deleteUsersByEmails([seed.first_user.email, seed.second_user.email], function() {
			// Create default user for local test cases
			utils.createUser(seed.first_user, done);
		});
	});

	describe('GET /logout - single user', () => {
		it('should login and logout and login again the default user', (done) => {
			// Login default user
			let credentials = { username: seed.first_user.email, password: seed.first_user.password };
			// First login
			utils.loginUser(credentials, null, function(cookie, user) {
				// Logout
				utils.logoutUser(cookie, function() {
					// Second login
					utils.loginUser(credentials, null, function(cookie, user) {
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
			utils.loginUser(credentials, null, function(cookie, user) {
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
			utils.loginUser(credentials, null, function(cookie, user) {
				// First logout
				utils.logoutUserWithError(null, done);
			});
		});
	});
});
