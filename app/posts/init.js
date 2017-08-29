// file:/app/posts/init.js
'use strict';

const manager 	= require('../postgreManager');
const passport 	= require('passport');
const multer  	= require('multer');
const path 		= require('path');
const config 	= require('config');
const fs 		= require('fs');
const validator = require('validator');

function _uncatchError(error, response) {
	console.log(error);
	return response.status(500).json({"status": 500, "message": `ERROR ${error.code}: ${error}`}); // Unkown error
};

function _returnPostIfValid(error, result, response) {
	if (error) {
		return _uncatchError(error, response);
	}

	const post = result[0]
	if (!post) {
		return response.status(400).json({"status": 400, "message": "Invalid post identifier"});
	} else {
		return response.status(200).json({"status": 200, "post": post});
	}
};

function _getLatestPostForUser(user_identifier, response) {
	manager.latestPostForUser(user_identifier, function(error, result) {
		return _returnPostIfValid(error, result, response);
	});
};

const multerUploaded = multer({
	dest: config.get("express.upload.destinationFolder"),
	limits: {
		fileSize: (config.get("express.upload.fileSizeInMB") * 1000 * 1000)
	},
	fileFilter: function(request, file, callback) {
		var filetypes = /jpeg|jpg|png/;
		var mimetype = filetypes.test(file.mimetype);
		var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
		if (mimetype && extname) {
			return callback(null, true);
		}
		callback("Error: File upload only supports the following filetypes - " + filetypes);
	}
}).single('image');

function getPosts(request, response) {
	manager.getPosts(function(error, result) {
		if (error) {
			return _uncatchError(error, response);
		} else {
			return response.json(result);
		}
	});
};

function minmax(min, max, value) {
	let number = parseFloat(value);
	return (number >= min && number <= max);
};

function verifyDateFormat(date) {
	// Use validator in the first place.
	if (validator.isISO8601(date) == false) {
		return false;
	}

	// And double check the exact format manually.
	let regex = /\d{4}-[01]\d{1}-[0-3]\d{1}T[0-2]\d{1}:[0-5]\d{1}:[0-5]\d{1}\.\d{3}Z/;
	let result = date.match(regex);
	return (result != null);
};

function verifyLngFormat(lng) {
	// -- Longitude: min/max from -180 to +180.
	let regex = /^[-]*[01]*[0-9]*[0-9].[0-9]{7}$/;
	let result = lng.match(regex);
	if (result != null) {
		return minmax(-180, 180, lng);
	}

	return false;
};

function verifyLatFormat(lat) {
	// -- Latitude: min/max from -90 to +90.
	let regex = /^[-]*[0-9]*[0-9].[0-9]{7}$/;
	let result = lat.match(regex);
	if (result != null) {
		return minmax(-90, 90, lat);
	}

	return false;
};

function verifyRatio(ratio) {
	// TODO: set this values in the config file.
	// -- Ratio: min/max from +0.2 to +10.
	let regex = /^[01]*[0-9][.]*\d*/;
	let result = ratio.match(regex);
	if (result != null) {
		// If valid check limits
		return minmax(0.2, 10, ratio);
	}

	return false;
};

function verifyParameters(post) {
	// All required field and values to create a new image post.
	const attributes = [
		{ key: "title", fct: null },
		{ key: "description", fct: null },
		{ key: "ratio", fct: verifyRatio },
		{ key: "location", fct: null },
		{ key: "lat", fct: verifyLatFormat },
		{ key: "lng", fct: verifyLngFormat },
		{ key: "date", fct: verifyDateFormat }
	];

	var invalidParameter = null;

	attributes.every(function(attribute, index) {
		if (!post[attribute.key] || !post[attribute.key].length) {
			invalidParameter = attribute.key;
			return false;
		}

		if (attribute.fct) {
			if (attribute.fct(post[attribute.key]) == false) {
				invalidParameter = attribute.key;
				return false;
			}
		}

		return true
	});

	return invalidParameter;
};

function createPost(request, response) {
	const user_identifier = request.session.passport['user'];
	multerUploaded(request, response, function(error) {
		if (error) {
			return response.status(400).json({"status": 400, "message": `ERROR ${error.code}: ${error}`});
		}

		const image = request.file; // request.file is the `image` file.
		if (!image) {
			return response.status(400).json({"status": 400, "message": "Missing image object"});
		}

		const post = request.body; // request.body will hold the text fields.
		const invalidParameter = verifyParameters(post)
		if (invalidParameter) {
			return response.status(400).json({"status": 400, "message": `Invalid or missing '${invalidParameter}' parameter`});
		}

		manager.createPost(post, image, user_identifier, function(error, result) {
			if (error) {
				return _uncatchError(error, response);
			} else {
				return _getLatestPostForUser(user_identifier, response);
			}
		});
	});
};

function initUploadFolder() {
	const destination = config.get("express.upload.destinationFolder");
	if (!fs.existsSync(destination)) {
		fs.mkdirSync(destination);
	}
};

function deletePost(request, response) {
	const user_identifier = request.session.passport['user'];
	manager.deletePostByIdForUser(request.params.post_id, user_identifier, function(error, result) {
		if (error) {
			return _uncatchError(error, response);
		} else {
			return response.status(200).json({"status": 200, "message": "Post successfully deleted"});
		}
	});
};

function getPost(request, response) {
	const identifier = request.params.post_id
	if (validator.isUUID(identifier) == false) {
		return response.status(400).json({"status": 400, "message": "Invalid post identifier"});
	}

	manager.getPostForIdentifier(identifier, function(error, result) {;
		return _returnPostIfValid(error, result, response);
	});
};

function getPostsForUser(request, response) {
	const identifier = request.params.user_id
	if (validator.isUUID(identifier) == false) {
		return response.status(400).json({"status": 400, "message": "Invalid user identifier"});
	}

	manager.getPostsForUser(identifier, function(error, result) {
		if (error) {
			return _uncatchError(error, response);
		} else {
			return response.json(result);
		}
	});
};

function initPosts (app) {
	initUploadFolder();

	// GET all posts for all users.
	app.get('/posts', getPosts);
	// GET all posts for one user.
	app.get('/posts/:user_id', getPostsForUser);
	// POST with an active session to create a new post.
	app.post('/post', passport.activeSessionRequired(), createPost);
	// GET one single post by its identifier
	app.get('/post/:post_id', getPost);
	// DELETE with an active session to delete one single post.
	app.delete('/post/:post_id', passport.activeSessionRequired(), deletePost);
	// TODO:
	// app.get('/posts/:user_id/latest', function); // another user.
	// app.get('/post/latest', passport.activeSessionRequired(), function); // current user.
};

module.exports = initPosts;
