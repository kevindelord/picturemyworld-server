// file:/test/posts_read.js
'use strict';

const chai      = require('chai');
const chaiHttp  = require('chai-http');
const server    = require('../app/index');
const manager	= require('../app/postgreManager');
const utils 	= require('./utils');
const seed 		= require('./seed');

let should = chai.should();

chai.use(chaiHttp);

describe('READ Posts', () => {

	beforeEach((done) => {
		// #1 create first user and login
		// #2 create first post and logout
		// #3 create second user and login
		// #4 create second post and logout
		done();
	});

	// Happy path
	// - Get all posts for all users
	// - Get all posts for current user
	// - Get info about one single post for current user
	// - Get info about one single post for other user

	// Error Cases
	// - 
});
