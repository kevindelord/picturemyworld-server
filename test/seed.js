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
	posts: {
		first: {
			title: 'image_title',
			description: 'ruins of chan chan',
			ratio: '1.333',
			location: 'Peru',
			lat: '1.3245612',
			lng: '-42.4567812',
			date: '2016-05-12T12:34:00.123Z'
		},
		second: {
			title: 'Ocean Image',
			description: 'that is a pier',
			ratio: '0.75',
			location: 'Lobitos',
			lat: '12.3245678',
			lng: '-4.4567812',
			date: '2016-05-12T12:34:00.123Z'
		}
	},
	images: {
		first: 'scripts/images/ruins.jpg',
		second: 'scripts/images/ocean.jpg',
		invalid: 'README.md'
	}
};

module.exports = seed
