// file:/test/posts_create.js
'use strict';

const chai		= require('chai');
const server	= require('../app/index');
const utils		= require('./utils');
const seed 		= require('./seed');
const should 	= chai.should();

const parameters = ["title", "description", "ratio", "location", "lat", "lng", "date"];
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
				utils.loginUser(credentials, null, function(cookie) {
					_cookie = cookie
					done();
				});
			});
		});
	});

	describe('POST /posts - simple post', () => {
		it('should create a new valid image post with logged in user', (done) => {
			utils.createImagePost(seed.posts.first, seed.images.first, _cookie, done);
		});

		it('should create the same post two times', (done) => {
			utils.createImagePost(seed.posts.first, seed.images.first, _cookie, function() {
				utils.createImagePost(seed.posts.first, seed.images.first, _cookie, done);
			});
		});
	});

	describe('POST /posts - multiple posts', () => {
		it('should create two diffent posts', (done) => {
			utils.createImagePost(seed.posts.first, seed.images.first, _cookie, function() {
				utils.createImagePost(seed.posts.second, seed.images.second, _cookie, done);
			});
		});
	});

	describe('POST /posts - different accounts', () => {
		it('should logout and login with another account and create a new post', (done) => {
			utils.logoutUser(_cookie, function() {
				let credentials = { username: seed.second_user.email, password: seed.second_user.password };
				utils.loginUser(credentials, null, function(cookie) {
					utils.createImagePost(seed.posts.second, seed.images.second, cookie, done);
				});
			});
		});
	});

	describe('POST /posts - invalid image post', () => {
		it('should create an invalid image post with wrong image type', (done) => {
			let message = "ERROR undefined: Error: File upload only supports the following filetypes - /jpeg|jpg|png/"
			utils.createImagePostWithError(seed.posts.first, seed.images.invalid, _cookie, 400, message, done);
		});
	});

	describe('POST /posts - missing image post', () => {
		it('should fail to create a post without any image', (done) => {
			utils.createImagePostWithError(seed.posts.first, null, _cookie, 400, "Missing image object", done);
		});
	});

	describe('POST /posts - empty parameters', () => {
		for (let key of parameters) {
			it(`should fail to create a post with empty ${key} parameter`, (done) => {
				var invalid_json = JSON.parse(JSON.stringify(seed.posts.first))
				invalid_json[key] = ''
				utils.createImagePostWithError(invalid_json, seed.images.first, _cookie, 400, `Invalid or missing '${key}' parameter`, done);
			});
		};
	});

	describe('POST /posts - null parameters', () => {
		for (let key of parameters) {
			it(`should fail to create a post with null ${key} parameter`, (done) => {
				var invalid_json = JSON.parse(JSON.stringify(seed.posts.first))
				invalid_json[key] = null
				utils.createImagePostWithError(invalid_json, seed.images.first, _cookie, 400, `Invalid or missing '${key}' parameter`, done);
			});
		};
	});

	describe('POST /posts - missing parameters', () => {
		for (let key of parameters) {
			it(`should fail to create a post with missing ${key} parameter`, (done) => {
				var invalid_json = JSON.parse(JSON.stringify(seed.posts.first))
				delete invalid_json[key]
				utils.createImagePostWithError(invalid_json, seed.images.first, _cookie, 400, `Invalid or missing '${key}' parameter`, done);
			});
		};
	});

	// Error Cases
	// - Send a image too big
	// - Create post not logged in

	// Regex check
	// - Check invalid date format
	// - Check invalid lat & lng
	// - Check invalid ratio
});
