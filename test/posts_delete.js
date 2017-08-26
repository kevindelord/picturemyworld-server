// file:/test/posts_delete.js
'use strict';

const chai      = require('chai');
const server    = require('../app/index');
const utils 	= require('./utils');
const seed 		= require('./seed');
const should 	= chai.should();

describe('DELETE Posts', () => {

	beforeEach((done) => {
		// #1 create user and login
		// #2 create post and retain identifier
		done();
	});

	// Happy path
	// - Create post and delete it with active user
	
	// Error Cases
	// - Do not delete a non-existing post 
	// - Login with other account, create a post and logout. Login with other account and try to delete post.
	// - No delete while logged out
});
