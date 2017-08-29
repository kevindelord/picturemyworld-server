// file:/test/users_get.js
'use strict';

const utils 	= require('./utils');
const seed 		= require('./seed');

describe('READ Users', () => {

	// Reset all users before each test (ie. each `it()` block).
	beforeEach((done) => {
		utils.deleteUsersByEmails([seed.first_user.email, seed.second_user.email], done);
	});

	describe('GET /users - empty database', () => {
		it('should GET no user as DB is empty', (done) => {
			utils.validateAllUsers(0, 200, function(users) {
				done();
			});
		});
	});

	describe('GET /users - multiple users', () => {
		it('should POST two users', (done) => {
			// create first user
			utils.createUser(seed.first_user, function() {
				// should GET only 1 user
				utils.validateAllUsers(1, 200, function(users) {
					utils.usersShouldBeValidAndEqual(users[0], seed.first_user);
					// create second user
					utils.createUser(seed.second_user, function() {
						// should GET only 2 users
						utils.validateAllUsers(2, 200, function(users) {
							utils.usersShouldBeValidAndEqual(users[0], seed.first_user);
							utils.usersShouldBeValidAndEqual(users[1], seed.second_user);
							done();
						});
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
				utils.validateAllUsers(1, 200, function(users) {
					utils.usersShouldBeValidAndEqual(users[0], seed.first_user, done);
				});
			});
		});
	});

	describe('GET /user - fetch information about the current account', () => {
		it('should GET valid user info data', (done) => {
			utils.createUser(seed.first_user, function() {
				let credentials = { username: seed.first_user.email, password: seed.first_user.password };
				utils.loginUser(credentials, null, function(cookie, logged_in_user) {
					utils.usersShouldBeValidAndEqual(logged_in_user, seed.first_user, null);
					utils.getCurrentUser(cookie, 200, null, function(retrieved_user) {
						utils.usersShouldBeValidAndEqual(retrieved_user, seed.first_user, done);
					});
				});
			});
		});

		it('should GET valid user info data', (done) => {
			utils.createUser(seed.first_user, function() {
				let credentials = { username: seed.first_user.email, password: seed.first_user.password };
				utils.loginUser(credentials, null, function(cookie, user) {
					utils.usersShouldBeValidAndEqual(user, seed.first_user, null);
					utils.logoutUser(cookie, function() {
						utils.getCurrentUser(cookie, 403, "Unauthorized", done);
					});
				});
			});
		});
	});

	describe('GET /user/:user_id - fetch information about an(other) account', () => {
		it('should GET valid user info data while logged out', (done) => {
			utils.createUserAndPost(seed.first_user, seed.posts.first, seed.images.first, function(user) {
				utils.getUserForIdentifier(user.id, null, 200, null, function(retrieved_user) {
					utils.usersShouldBeValidAndEqual(user, retrieved_user, done);
					utils.usersShouldBeValidAndEqual(user, seed.first_user, null);
				});
			});
		});

		it('should GET valid user info data while logged in', (done) => {
			utils.createUserAndPost(seed.first_user, seed.posts.first, seed.images.first, function(user) {
				let credentials = { username: seed.first_user.email, password: seed.first_user.password };
				utils.loginUser(credentials, null, function(cookie, logged_in_user) {
					utils.getUserForIdentifier(user.id, cookie, 200, null, function(retrieved_user) {
						utils.usersShouldBeValidAndEqual(user, retrieved_user, null);
						utils.usersShouldBeValidAndEqual(user, logged_in_user, null);
						utils.usersShouldBeValidAndEqual(user, seed.first_user, null);
						done();
					});
				});
			});
		});

		it('should GET valid user info data', (done) => {
			utils.createUser(seed.first_user, function() {
				let credentials = { username: seed.first_user.email, password: seed.first_user.password };
				utils.loginUser(credentials, null, function(cookie, user) {
					utils.usersShouldBeValidAndEqual(user, seed.first_user, null);
					utils.logoutUser(cookie, function() {
						utils.getCurrentUser(cookie, 403, "Unauthorized", done);
					});
				});
			});
		});

		it('should GET error for non-existing user identifier', (done) => {
			utils.getUserForIdentifier("02d1ced4-1111-2222-3333-444455559c74", null, 400, "Invalid user identifier", done);
		});

		it('should GET error for invalid user identifier', (done) => {
			utils.getUserForIdentifier("this is not a UUID", null, 400, "Invalid user identifier", done);
		});

		it('should GET valid data about another user (not the one logged in)', (done) => {
			utils.createUserAndPost(seed.first_user, seed.posts.first, seed.images.first, function(first_user) {
				utils.createUserAndPost(seed.second_user, seed.posts.second, seed.images.second, function(second_user) {
					let credentials = { username: seed.second_user.email, password: seed.second_user.password };
					utils.loginUser(credentials, null, function(cookie, user) {
						utils.getUserForIdentifier(first_user.id, cookie, 200, null, function(retrieved_user) {
							utils.usersShouldBeValidAndEqual(first_user, retrieved_user, done);
						});
					});
				});
			});
		});
	});
});
