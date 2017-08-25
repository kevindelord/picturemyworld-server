// file:/test/seed.js
'use strict';

let seed = {
	first_user: {
		email: 'test@mail.com',
		username: 'alex',
		password: 'superpass'
	},
	second_user: {
		email: 'johne@dooe.com',
		username: 'bond',
		password: 'secret_agent'
	},
	user_with_missing_email: {
		username: 'alex',
		password: 'superpass'
	},
	user_with_missing_password: {
		email: 'test@mail.com',
		username: 'alex',
	},
	user_with_missing_username: {
		email: 'test@mail.com',
		password: 'superpass'
	},
	user_with_empty_password: {
		email: 'test@mail.com',
		username: 'alex',
		password: ''
	},
	user_with_empty_username: {
		email: 'test@mail.com',
		username: '',
		password: 'superpass'
	},
	user_with_empty_email: {
		email: '',
		username: 'superpass',
		password: 'superpass'
	},
	user_with_invalid_email: {
		email: 'this is not an email',
		username: 'superpass',
		password: 'superpass'
	},
};

module.exports = seed
