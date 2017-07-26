// file:/scripts/postgreManager.js
'use strict';

const pg = require('pg')
const config = require('../config/config')

function connect(url, next) {
	pg.connect(url, function (error, client, done) {
		if (error) {
			console.log(`ERROR: ${error}`)
		} else {
			next(client, done)
		}
	})
}

function executeQuery(client, query, next) {
	executeQueries(client, [query], 0, next)
}

function executeQueries(client, queries, index, next) {
	if (index >= queries.length) {
		return next(client)
	}

	client.query(queries[index], function (error, result) {
		if (error) {
			console.log(`ERROR: ${error}`)
		} else {
			executeQueries(client, queries, index + 1, next)
		}
	})
}

module.exports.executeQuery = executeQuery
module.exports.executeQueries = executeQueries
module.exports.connect = connect
