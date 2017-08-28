// file:/test/posts_read.js
'use strict';

const chai      = require('chai');
const utils 	= require('./utils');
const seed 		= require('./seed');
const should 	= chai.should();

describe('READ Posts', () => {

	beforeEach((done) => {
		done();
	});

	before((done) => {
		// Remove all user accounts
		utils.deleteUsersByEmails([seed.first_user.email, seed.second_user.email], function() {
			// #1 create first user and login
			// #2 create first post and logout
			// #3 create second user and login
			// #4 create second post and logout
			createUserAndPost(seed.first_user, seed.posts.first, seed.images.first, function() {
				createUserAndPost(seed.second_user, seed.posts.second, seed.images.second, done);
			});
		});
	});

	function createUserAndPost(user, post, image, callback) {
		// Create first user account
		utils.createUser(user, function() {
			// Login with first user account
			let credentials = { username: user.email, password: user.password };
			utils.loginUser(credentials, null, function(cookie) {
				utils.createImagePost(post, image, cookie, function() {
					utils.logoutUser(cookie, callback);
				});
			});
		});
	}

	beforeEach((done) => {
		done();
	});

	describe('GET /posts - all posts', () => {
		it('should get all existing posts', (done) => {
			utils.getAllImagePosts(2, null, function(posts) {
				let seedPosts = [seed.posts.first, seed.posts.second];
				posts.forEach(function(post, index) {
					delete post.updated_at
					delete post.created_at
					post.should.eql(seedPosts[index]);
				});
				done();
			});
		});

		it('should get same posts when logged in or not', (done) => {
			let credentials = { username: seed.first_user.email, password: seed.first_user.password };
			utils.loginUser(credentials, null, function(cookie) {
				utils.getAllImagePosts(2, cookie, function(posts) {
					let loggedInPosts = posts
					utils.logoutUser(cookie, function() {
						utils.getAllImagePosts(2, null, function(posts) {
							loggedInPosts.should.eql(posts);
							done();
						});
					});
				});
			});
		});
	});

	// Happy path
	// - Get all posts for current user
	// - Get info about one single post for current user
	// - Get info about one single post for other user

	// Error Cases
	// - Get empty array/dictionary with invalid id.
});
