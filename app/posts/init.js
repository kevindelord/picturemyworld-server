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
	const post = request.body
	post.user_id = request.session.passport['user']
	manager.createPost(post, function (error, result) {
		if (error) {
			return response.status(500).json({"status": 500, "message": `ERROR: ${error}`})
		} else {
			return response.status(200).json({"status": 200, "message": "New post successfully created"})
		}
	})
}

function createPostWithImage(request, response) {
	const upload = multer({ dest: 'uploads/' }).single('image')
	upload(request, response, function (error) {
		// req.file is the `avatar` file.
		// req.body will hold the text fields, if there were any.
		console.log(request.file)
		console.log(request.body)

		if (error) {
			return response.status(400).json({"status": 400, "message": `${error}`, "code": `${error["code"]}`})
		} else {
			return response.status(200).json({"status": 200, "message": "New Image Uploaded"})
		}
	})
}

function initPosts (app) {
	app.get('/posts', passport.authenticationMiddleware(), getPosts)
	app.post('/post', passport.authenticationMiddleware(), createPost)
	app.post('/upload', passport.authenticationMiddleware(), createPostWithImage)
}

module.exports = initPosts
