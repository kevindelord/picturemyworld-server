// file:/app/posts/init.js
'use strict';

const manager 	= require('../postgreManager');
const passport 	= require('passport');
const multer  	= require('multer');
const path 		= require('path');
const config 	= require('config');
const fs 		= require('fs');

const multerUploaded = multer({
	dest: config.get("express.upload.destinationFolder"),
	limits: {
		fileSize: (config.get("express.upload.fileSizeInMB") * 1000 * 1000)
	},
	fileFilter: function (request, file, callback) {
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
	manager.getPosts(function (error, result) {
		if (error) {
			return response.status(500).json({"status": 500, "message": `ERROR ${error.code}: ${error}`});
		} else {
			return response.json(result);
		}
	});
}

function verifyDateFormat(date) {
	let regex = /\d{4}-[01]\d{1}-[0-3]\d{1}T[0-2]\d{1}:[0-5]\d{1}:[0-5]\d{1}\.\d{3}Z/;
	let result = date.match(regex);
	return (result != null);
};

function verifyLngFormat(lng) {
	// -- Longitude: max/min +180 to -180
	let regex = /^[-]*[01]*[0-9]*[0-9].[0-9]{7}$/;
	let result = lng.match(regex);
	return (result != null);
};

function verifyLatFormat(lat) {
	// -- Latitude: max/min +90 to -90
	let regex = /^[-]*[0-9]*[0-9].[0-9]{7}$/;
	let result = lat.match(regex);
	return (result != null);
};

function verifyRatio(ratio) {
	// -- Ratio: max/min +10 to 0.2
	let regex = /^[01]*[0-9][.]*\d*/;
	let result = ratio.match(regex);
	return (result != null);
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
	multerUploaded(request, response, function (error) {
		if (error) {
			return response.status(400).json({"status": 400, "message": `ERROR ${error.code}: ${error}`});
		}

		const image = request.file; // request.file is the `image` file.
		if (!image) {
			return response.status(400).json({"status": 400, "message": "Missing image object"});
		}

		const post = request.body;	// request.body will hold the text fields.
		const invalidParameter = verifyParameters(post)
		if (invalidParameter) {
			return response.status(400).json({"status": 400, "message": `Invalid or missing '${invalidParameter}' parameter`});
		}

		manager.createImagePost(post, image, user_identifier, function (error, result) {
			if (error) {
				return response.status(500).json({"status": 500, "message": `ERROR ${error.code}: ${error}`});
			} else {
				return response.status(200).json({"status": 200, "message": "New post successfully created"});
			}
		});
	});
}

function initUploadFolder() {
	const destination = config.get("express.upload.destinationFolder");
	if (!fs.existsSync(destination)) {
		fs.mkdirSync(destination);
	}
}

function initPosts (app) {
	initUploadFolder();

	app.get('/posts', passport.activeSessionRequired(), getPosts);
	app.post('/post', passport.activeSessionRequired(), createPost);
}

module.exports = initPosts;
