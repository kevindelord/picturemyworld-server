// file:/app/users/init.js
'use strict';

const postgreManager = require('../postgreManager')

function initUsers (app) {
	app.post('/users', postgreManager.createUser)
	app.get('/users', postgreManager.getUsers)
}

module.exports = initUsers
