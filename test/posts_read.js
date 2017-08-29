// file:/test/posts_read.js
'use strict';

const utils 	= require('./utils');
const seed 		= require('./seed');
const should 	= require('chai').should();

var _first_post = null;
var _second_post = null;

describe('READ Posts', () => {

	before((done) => {
		// Remove all user accounts
		utils.deleteUsersByEmails([seed.first_user.email, seed.second_user.email], function() {
			// #1 create first user and login
			// #2 create first post and logout
			// #3 create second user and login
			// #4 create second post and logout
			utils.createUserAndPost(seed.first_user, seed.posts.first, seed.images.first, function(user, first_post) {
				_first_post = first_post;
				utils.createUserAndPost(seed.second_user, seed.posts.second, seed.images.second, function(user, second_post) {
					_second_post = second_post
					done();
				});
			});
		});
	});

	beforeEach((done) => {
		done();
	});

	describe('GET /posts - all posts', () => {
		it('should get all existing posts', (done) => {
			utils.getAllPosts(2, null, function(posts) {
				let seed_posts = [seed.posts.first, seed.posts.second];
				posts.forEach(function(post, index) {

					var seed_json = JSON.parse(JSON.stringify(seed_posts[index]));
					delete seed_json.id;
					delete seed_json.updated_at;
					delete seed_json.created_at;

					utils.postsShouldBeValidAndEqual(post, seed_json, null);
				});
				done();
			});
		});

		it('should get same posts when logged in or not', (done) => {
			let credentials = { username: seed.first_user.email, password: seed.first_user.password };
			utils.loginUser(credentials, null, function(cookie, user) {
				utils.getAllPosts(2, cookie, function(posts) {
					let loggedInPosts = posts
					utils.logoutUser(cookie, function() {
						utils.getAllPosts(2, null, function(posts) {
							loggedInPosts.should.eql(posts);
							done();
						});
					});
				});
			});
		});
	});

	function _checkExistingPosts(cookie, done) {
		// check first post
		utils.getPostForIdentifier(_first_post.id, cookie, function(post) {
			utils.postsShouldBeValidAndEqual(_first_post, post, null);
		});
		// check second post
		utils.getPostForIdentifier(_second_post.id, cookie, function(post) {
			utils.postsShouldBeValidAndEqual(_second_post, post, done);
		});
	}

	describe('GET /post/:post_id', () => {
		it('should return empty array for non-existing UUID', (done) => {
			utils.getPostForIdentifierWithError("d71111e6-cccc-bbbb-aaaa-6700b28a7fb9", null, 400, "Invalid post identifier", done);
		});

		it('should return empty array for invalid post identifier', (done) => {
			utils.getPostForIdentifierWithError("fake_identifier", null, 400, "Invalid post identifier", done);
		});

		it('should return valid post while being logged out', (done) => {
			_checkExistingPosts(null, done);
		});

		it('should return valid post while being logged in', (done) => {
			let credentials = { username: seed.first_user.email, password: seed.first_user.password };
			utils.loginUser(credentials, null, function(cookie, user) {
				_checkExistingPosts(cookie, done);
			});
		});
	});

	// TODO:
	// GET all posts for one user.
	// app.get('/posts/:user_id', getPostsForUser);
	// -> check valid list of all post for current user.
	// -> check that post of other users are not sent
	// -> check non-existing UUID
	// -> check invalid identifier
});
