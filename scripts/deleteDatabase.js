// file:/scripts/deleteDatabase.js
'use strict';

const config 	= require('config');
const manager 	= require('./postgreManager');

var query = {};
query.deleteDatabase = `DROP DATABASE ${config.get("postgre.database")};`;

// Connect to existing database and then insert values.
console.log("Connect to PostgreSQL database...");
manager.connect(manager.initURL(), function (client) {
	console.log("Remove database from PostgreSQL...");
	manager.executeQuery(client, query.deleteDatabase, function (client) {
		client.end();
		process.exit(0);
	});
});
