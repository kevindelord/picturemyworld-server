// file:/test/posts_create.js
'use strict';

const chai      = require('chai');
const chaiHttp  = require('chai-http');
const server    = require('../app/index');
const manager	= require('../app/postgreManager');
const utils 	= require('./utils');
const seed 		= require('./seed');

let should = chai.should();

chai.use(chaiHttp);

describe('CREATE Posts', () => {

	beforeEach((done) => {
		// #1 create user and login
		// #2 delete all posts for current user
		done();
	});

	// Happy path
	// - Create simple post with logged in user
	// - Create the same post multiple times
	// - Create different posts

	// Error Cases
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
