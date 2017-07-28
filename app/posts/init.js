// file:/app/posts/init.js
'use strict';

const manager 	= require('../postgreManager')
const passport 	= require('passport')
const multer  = require('multer')

function getPosts(request, response) {
	manager.getPosts(function (error, result) {
		if (error) {
			return response.status(500).json({"status": 500, "message": `ERROR: ${error}`})
		} else {
			return response.json(result)
		}
	})
}

function createPost(request, response) {
	const user_identifier = request.session.passport['user']
	const upload = multer({ dest: './user_uploads/' }).single('image')
	upload(request, response, function (error) {
		if (error) {
			return response.status(400).json({"status": 400, "message": `${error}`, "code": `${error["code"]}`})
		}
		const post = request.body	// request.body will hold the text fields.
		const image = request.file 	// request.file is the `image` file.
		if (!image) {
			// TODO: do this with a multer filter?
			return response.status(400).json({"status": 400, "message": `Missing image object`, "code": "undefined"})
		}

		manager.createImagePost(post, image, user_identifier, function (error, result) {
			if (error) {
				return response.status(500).json({"status": 500, "message": `${error}`, "code": `${error["code"]}`})
			} else {
				return response.status(200).json({"status": 200, "message": "New post successfully created"})
			}
		})
	})
}

function initPosts (app) {
	app.get('/posts', passport.authenticationMiddleware(), getPosts)
	app.post('/post', passport.authenticationMiddleware(), createPost)
}

module.exports = initPosts
