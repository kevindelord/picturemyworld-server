// file:/test/posts_delete.js
'use strict';

const utils 	= require('./utils');
const seed 		= require('./seed');

describe('DELETE Posts', () => {

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

	// Happy path
	// - Create post and delete it with active user

	// Error Cases
	// - Do not delete a non-existing post
	// - Login with other account, create a post and logout. Login with other account and try to delete post.
	// - No delete while logged out

	// TODO:
	// DELETE with an active session to delete one single post.
	// app.delete('/post/:post_id', passport.activeSessionRequired(), deletePost);
});
