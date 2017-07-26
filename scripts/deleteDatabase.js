#! /usr/bin/env node
'use strict';

const config = require('../config/config')
const manager = require('./postgreManager')

var query = {};
query.deleteDatabase = `DROP DATABASE ${config.postgre.database};`

// Connect to existing database and then insert values.
console.log("Connect to PostgreSQL database...")
manager.connect(config.postgre.initURL, function (client) {
	console.log("Remove database from PostgreSQL...")
	manager.executeQuery(client, query.deleteDatabase, function (client) {
		client.end()
		process.exit(0)
	})
})
