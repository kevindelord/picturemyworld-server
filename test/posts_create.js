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

		it('should not create a post while logged out', (done) => {
			utils.logoutUser(_cookie, function() {
				utils.createImagePostWithError(seed.posts.first, seed.images.first, _cookie, 403, "Unauthorized", done);
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


	describe('POST /posts - invalid parameters', () => {
		let data = [
			{ key: "title", value: "" },
			{ key: "description", value: "" },
			// -- Ratio: max/min +10 to 0.2
			{ key: "ratio", value: "this is not a valid ratio" },
			{ key: "ratio", value: -2.33 },
			{ key: "ratio", value: 0 },
			{ key: "ratio", value: 11 },
			// -- Location: should be a text
			{ key: "location", value: "" },
			// -- Latitude: max/min +90 to -90
			{ key: "lat", value: "this is not a valid lat" },
			{ key: "lat", value: -100.779 },
			{ key: "lat", value: 1234.789 },
			{ key: "lat", value: 90.5 },
			{ key: "lat", value: -90.5 },
			{ key: "lat", value: 40.12345 },
			{ key: "lat", value: -40.12345678 },
			// -- Longitude: max/min +180 to -180
			{ key: "lng", value: "this is not a valid lng" },
			{ key: "lng", value: 180.5 },
			{ key: "lng", value: -180.5 },
			{ key: "lng", value: 100.57865 },
			{ key: "lng", value: -200.779 },
			{ key: "lng", value: 1234.789 },
			{ key: "lng", value: 34.1234567890 },
			// -- Date format
			{ key: "date", value: "this is not a date string" },
			// let regex = /\d{4}-[01]\d{1}-[0-3]\d{1}T[0-2]\d{1}:[0-5]\d{1}:[0-5]\d{1}\.\d{3}Z/;
			{ key: "date", value: "2016-15-12 12:34:00.123Z" },
			{ key: "date", value: "2016-05-12" },
			{ key: "date", value: "2016-05-12T12:34:00" }
		]

		for (let pair of data) {
			it(`should fail to create a post with invalid ${pair.key} parameter with value: ${pair.value}`, (done) => {
				var invalid_json = JSON.parse(JSON.stringify(seed.posts.first))
				invalid_json[pair.key] = pair.value
				utils.createImagePostWithError(invalid_json, seed.images.first, _cookie, 400, `Invalid or missing '${pair.key}' parameter`, done);
			});
		};
	});

	describe('POST /posts - valid parameters', () => {
		let data = [
			// -- Ratio: max/min +10 to 0.2
			{ key: "ratio", value: 2.33 },
			{ key: "ratio", value: 0.3486 },
			{ key: "ratio", value: 2.3567893 },
			{ key: "ratio", value: 8 },
			{ key: "ratio", value: 2 },
			// -- Latitude: max/min +90 to -90
			{ key: "lat", value: 34.7895553 },
			// -- Longitude: max/min +180 to -180
			{ key: "lng", value: -100.1234567 },
			// -- Date format
			// let regex = /\d{4}-[01]\d{1}-[0-3]\d{1}T[0-2]\d{1}:[0-5]\d{1}:[0-5]\d{1}\.\d{3}Z/;
			{ key: "date", value: "2016-03-12T12:34:00.123Z" }
		]

		for (let pair of data) {
			it(`should create a post with valid ${pair.key} parameter with value: ${pair.value}`, (done) => {
				var invalid_json = JSON.parse(JSON.stringify(seed.posts.first))
				invalid_json[pair.key] = pair.value
				utils.createImagePost(invalid_json, seed.images.first, _cookie, done);
			});
		};
	});

	// Error Cases
	// - Send a image too big
	// - Should parameters be strong typed?
});
