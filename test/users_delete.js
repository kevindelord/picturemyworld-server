// file:/test/users_delete.js
'use strict';

const chai      = require('chai');
const server    = require('../app/index');
const utils 	= require('./utils');
const seed 		= require('./seed');
const should 	= chai.should();

describe('DELETE Users', () => {

	beforeEach((done) => {
		// #1 create user
		done();
	});

	// Happy path
	// - Delete user and related posts (and related sessions?)

	// Error Cases
	// - Do not delete a non-existing user
});
