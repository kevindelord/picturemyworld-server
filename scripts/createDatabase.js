#! /usr/bin/env node
'use strict';

const pg = require('pg')
const config = require('../config/config')
const exec = require('child_process').exec;
const manager = require('../app/postgreManager')

var query = {};
query.createdb = `CREATE DATABASE ${config.postgre.database}`

query.addUUIDExtension = 'CREATE EXTENSION "uuid-ossp";'

query.createUsersTable = "CREATE TABLE USERS(	ID UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),\
												EMAIL TEXT UNIQUE NOT NULL,\
												USERNAME TEXT NOT NULL,\
												PASSWORD TEXT NOT NULL);"

query.createPostsTable = "CREATE TABLE POSTS(	ID INT PRIMARY KEY NOT NULL,\
												TITLE CHAR(60) NOT NULL,\
												DESCRIPTION TEXT NOT NULL,\
												LOCATION TEXT NOT NULL,\
												LAT DOUBLE PRECISION NOT NULL,\
												LNG DOUBLE PRECISION NOT NULL,\
												DATE DATE NOT NULL,\
												RATIO DECIMAL NOT NULL);"

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
		process.exit(0)
	})
})
