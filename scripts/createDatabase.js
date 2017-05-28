#! /usr/bin/env node

const pg = require('pg')
const config = require('../config/config')
const exec = require('child_process').exec;
const manager = require('../app/postgreManager')

var query = {};
query.createdb = `CREATE DATABASE ${config.postgre.database}` 
query.createUsersTable = "CREATE TABLE USERS(	ID INT PRIMARY KEY NOT NULL,\
												USERNAME TEXT NOT NULL,\
												EMAIL TEXT NOT NULL);"

query.createPostsTable = "CREATE TABLE POSTS(	ID INT PRIMARY KEY NOT NULL,\
												TITLE CHAR(60) NOT NULL,\
												DESCRIPTION TEXT NOT NULL,\
												LOCATION TEXT NOT NULL,\
												LAT DOUBLE PRECISION NOT NULL,\
												LNG DOUBLE PRECISION NOT NULL,\
												DATE DATE NOT NULL,\
												RATIO DECIMAL NOT NULL);"

function createTables(client, done) {
	console.log("Create 'users' table...")
	manager.executeQueries(client, [query.createUsersTable, query.createPostsTable], 0, function (client) {
		done()
		process.exit(0)
	})
}

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

// Init, create and connect to database, then create tables.
connectDatabase(createTables)
