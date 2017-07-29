// file:/scripts/postgreManager.js
'use strict';

const pg 		= require('pg');
const config 	= require('config');

function initURL() {
	return `postgres://${config.get("postgre.user")}:${config.get("postgre.password")}@${config.get("postgre.host")}`;
}

function connectURL() {
	return `postgres://${config.get("postgre.user")}:${config.get("postgre.password")}@${config.get("postgre.host")}/${config.get("postgre.database")}`;
}

function connect(url, next) {
	var pool = new pg.Pool({
		connectionString: url
	});
	pool.connect(function (error, client, release) {
		if (error) {
			console.log(`ERROR: ${error}`);
		} else {
			next(client);
		}
	});
	pool.end();
}

function executeQuery(client, query, next) {
	executeQueries(client, [query], 0, next);
}

function executeQueries(client, queries, index, next) {
	if (index >= queries.length) {
		return next(client);
	}

	client.query(queries[index], function (error, result) {
		if (error) {
			console.log(`ERROR: ${error}`);
		}

		executeQueries(client, queries, index + 1, next);
	});
}

module.exports.executeQuery = executeQuery;
module.exports.executeQueries = executeQueries;
module.exports.connect = connect;
module.exports.initURL = initURL;
module.exports.connectURL = connectURL;
