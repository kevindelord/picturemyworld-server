// file:/app/posts/init.js
'use strict';

const postgreManager = require('../postgreManager')

function initPosts (app) {
	app.get('/posts', postgreManager.getPosts)
}

module.exports = initPosts
