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
			return response.status(500).json({"status": 500, "message": `ERROR: ${error}`});
		} else {
			return response.json(result);
		}
	});
}

function createPost(request, response) {
	const user_identifier = request.session.passport['user'];
	multerUploaded(request, response, function (error) {
		if (error) {
			return response.status(400).json({"status": 400, "message": `${error}`, "code": `${error["code"]}`});
		}
		const post = request.body;	// request.body will hold the text fields.
		const image = request.file; // request.file is the `image` file.
		if (!image) {
			return response.status(400).json({"status": 400, "message": "Missing image object", "code": "undefined"});
		}

		manager.createImagePost(post, image, user_identifier, function (error, result) {
			if (error) {
				return response.status(500).json({"status": 500, "message": `${error}`, "code": `${error["code"]}`});
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

	app.get('/posts', passport.authenticationMiddleware(), getPosts);
	app.post('/post', passport.authenticationMiddleware(), createPost);
}

module.exports = initPosts;
