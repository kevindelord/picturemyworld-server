// file:/app/posts/init.js
'use strict';

const manager 	= require('../postgreManager')
const passport 	= require('passport')

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

function initPosts (app) {
	app.get('/posts', passport.authenticationMiddleware(), getPosts)
	app.post('/post', passport.authenticationMiddleware(), createPost)
}

module.exports = initPosts
