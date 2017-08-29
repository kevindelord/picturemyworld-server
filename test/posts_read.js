// file:/test/posts_read.js
'use strict';

const utils 	= require('./utils');
const seed 		= require('./seed');
const should 	= require('chai').should();
const validator	= require('validator');

describe('READ Posts', () => {

	before((done) => {
		// Remove all user accounts
		utils.deleteUsersByEmails([seed.first_user.email, seed.second_user.email], function() {
			// #1 create first user and login
			// #2 create first post and logout
			// #3 create second user and login
			// #4 create second post and logout
			utils.createUserAndPost(seed.first_user, seed.posts.first, seed.images.first, function(user) {
				utils.createUserAndPost(seed.second_user, seed.posts.second, seed.images.second, function(user) {
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
				let seedPosts = [seed.posts.first, seed.posts.second];
				posts.forEach(function(post, index) {
					// id
					post.should.have.property('id');
					post.id.should.be.a('string');
					validator.isUUID(post.id);
					// created_at
					post.should.have.property('created_at');
					post.created_at.should.be.a('string');
					validator.isISO8601(post.created_at);
					// updated_at
					post.should.have.property('updated_at');
					post.updated_at.should.be.a('string');
					validator.isISO8601(post.updated_at);
					delete post.id;
					delete post.updated_at;
					delete post.created_at;
					// All other attributes
					post.should.eql(seedPosts[index]);
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

	describe('GET /post/:post_id', () => {
		it('should return empty array for non-existing UUID', (done) => {
			utils.getPostForIdentifierWithError("d71111e6-cccc-bbbb-aaaa-6700b28a7fb9", null, 400, "Invalid post identifier", done);
		});

		it('should return empty array for invalid post identifier', (done) => {
			utils.getPostForIdentifierWithError("fake_identifier", null, 400, "Invalid post identifier", done);
		});
	});

	// TODO:
	// GET all posts for one user.
	// app.get('/posts/:user_id', getPostsForUser);
	// -> check valid list of all post for current user.
	// -> check that post of other users are not sent
	// -> check non-existing UUID
	// -> check invalid identifier

	// GET one single post by its identifier
	// app.get('/post/:post_id', getPost);
	// -> check validity of received information for a post of the current user
	// -> check validity of received information for a post of another user
});
