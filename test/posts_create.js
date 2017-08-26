// file:/test/posts_create.js
'use strict';

const chai      = require('chai');
const server    = require('../app/index');
const utils 	= require('./utils');
const seed 		= require('./seed');
const should 	= chai.should();

var _cookie = null

describe('CREATE Posts', () => {

	before((done) => {
		// Remove all user accounts
		utils.deleteUsersByEmails([seed.first_user.email, seed.second_user.email], function() {
			// Create first user account
			utils.createUser(seed.first_user, function() {
				// Create second user account
				utils.createUser(seed.second_user, done);
			});
		});
	});

	beforeEach((done) => {
		// Delete all posts for all seed users
		utils.deleteAllPostsForUser(seed.first_user, function() {
			utils.deleteAllPostsForUser(seed.second_user, function() {
				// Login with first seed user account.
				let credentials = { username: seed.first_user.email, password: seed.first_user.password };
				utils.loginUserWithCredentials(credentials, _cookie, function(cookie) {
					_cookie = cookie
					done();
				});
			});
		});
	});

	describe('POST /posts - single post', () => {
		it('should create a new image post with logged in user', (done) => {
			utils.createImagePost(seed.posts.default, seed.posts.images.default, _cookie, done);
		});
	});

	// Happy path
	// - Create the same post multiple times
	// - Create different posts
	// - Logout/login and create post with different user account

	// Error Cases
	// - no create when logged out
	// - Send document which is not an image
	// - Send a image too big
	// - Create post with missing data/parameters
	// - Create post not logged in
	// - Send empty description or title

	// Regex check
	// - Check invalid date format
	// - Check invalid lat & lng
	// - Check invalid ratio
});
