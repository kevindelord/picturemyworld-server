#! /usr/bin/env node
'use strict';

const config = require('../config/config')
const manager = require('./postgreManager')
const exec = require('child_process').exec;

var query = {};
query.createdb = `CREATE DATABASE ${config.postgre.database}`
query.addUUIDExtension = 'CREATE EXTENSION "uuid-ossp";'

query.createUsersTable = "CREATE TABLE users\
	(\
		id 			UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),\
		email 		TEXT UNIQUE NOT NULL,\
		username 	TEXT NOT NULL,\
		password 	TEXT NOT NULL,\
		created_at	TIMESTAMP DEFAULT current_timestamp,\
		updated_at	TIMESTAMP DEFAULT current_timestamp\
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
		user_id 	UUID NOT NULL,\
		created_at	TIMESTAMP DEFAULT current_timestamp,\
		updated_at	TIMESTAMP DEFAULT current_timestamp,\
		FOREIGN KEY	(user_id) REFERENCES users(id) ON DELETE cascade\
	);"

query.autoUpdateFunction = "CREATE OR REPLACE FUNCTION update_modified_column()\
RETURNS TRIGGER AS $$\
BEGIN\
    NEW.updated_at = now();\
    RETURN NEW;\
END;\
$$ language 'plpgsql';"

query.autoUpdatePosts = "CREATE TRIGGER update_customer_modtime BEFORE UPDATE ON posts FOR EACH ROW EXECUTE PROCEDURE update_modified_column();"
query.autoUpdateUsers = "CREATE TRIGGER update_customer_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_modified_column();"

// Create session table for the user authentification.
function createSessionTable() {
	var shellCommand = {};
	shellCommand.createSessionTable = `psql ${config.postgre.database} < node_modules/connect-pg-simple/table.sql`
	exec(shellCommand.createSessionTable, (error, stdout, stderr) => {
		if (error) {
			console.log(`stderr: ${stderr}`);
			console.error(`exec error: ${error}`);
			return;
		}
		process.exit(0)
	});
}

// Connect to the default database, create and connect to the new one.
function connectDatabase(next) {
	console.log("Initial connection to PostgreSQL database...")
	manager.connect(config.postgre.initURL, function (client) {
		console.log("Create and connect to new database...")
		manager.executeQuery(client, query.createdb, function (client) {
			// Release the first client
			client.end()
			console.log("Connect to new database...")
			manager.connect(config.postgre.connectURL, next)
		})
	})
}

// Init, create and connect to database.
connectDatabase(function (client) {
	console.log("Create tables...")
	const queries = [
		query.addUUIDExtension,
		query.createUsersTable,
		query.createPostsTable,
		query.autoUpdateFunction,
		query.autoUpdatePosts,
		query.autoUpdateUsers
	]
	// Execute queries to create tables.
	manager.executeQueries(client, queries, 0, function (client) {
		client.end()
		createSessionTable()
	})
})
