#! /usr/bin/env node
'use strict';

const config = require('../config/config')
const manager = require('./postgreManager')
const exec = require('child_process').exec;

var shellCommand = {};
shellCommand.createSessionTable = `psql ${config.postgre.database} < node_modules/connect-pg-simple/table.sql`

var query = {};
query.createdb = `CREATE DATABASE ${config.postgre.database}`
query.addUUIDExtension = 'CREATE EXTENSION "uuid-ossp";'

query.createUsersTable = "CREATE TABLE users\
	(\
		id 			UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),\
		email 		TEXT UNIQUE NOT NULL,\
		username 	TEXT NOT NULL,\
		password 	TEXT NOT NULL\
	);"

query.createPostsTable = "CREATE TABLE posts\
	(\
		id 			UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),\
		title 		CHAR(60) NOT NULL,\
		description	TEXT NOT NULL,\
		location 	TEXT NOT NULL,\
		lat 		DOUBLE PRECISION NOT NULL,\
		lng 		DOUBLE PRECISION NOT NULL,\
		date 		DATE NOT NULL,\
		ratio 		DECIMAL NOT NULL,\
		userId 		UUID NOT NULL,\
		FOREIGN KEY	(userId) REFERENCES users(id) ON DELETE cascade\
	);"

// Connect to the default database, create and connect to the new one.
function connectDatabase(next) {
	console.log("Initial connection to PostgreSQL database...")
	manager.connect(config.postgre.initURL, function (client, done) {
		console.log("Create new database...")
		manager.executeQuery(client, query.createdb, function (client) {
			done()
			console.log("Connect to new database...")
			manager.connect(config.postgre.connectURL, next)
		})
	})
}

// Init, create and connect to database.
connectDatabase(function (client, done) {
	console.log("Create tables...")
	const queries = [
		query.addUUIDExtension,
		query.createUsersTable,
		query.createPostsTable
	]
	// Execute queries to create tables.
	manager.executeQueries(client, queries, 0, function (client) {
		done()
		exec(shellCommand.createSessionTable, (error, stdout, stderr) => {
			if (error) {
				console.log(`stderr: ${stderr}`);
				console.error(`exec error: ${error}`);
				return;
			}
			process.exit(0)
		});
	})
})
