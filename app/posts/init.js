// file:/app/posts/init.js
'use strict';

const manager = require('../postgreManager')

function getPosts(request, response) {
	manager.getPosts(function (error, result) {
		if (error) {
			return response.status(500).send(`ERROR: ${error}`)
		} else {
			return response.json(result)
		}
	})
}

function initPosts (app) {
	app.get('/posts', getPosts)
}

module.exports = initPosts
