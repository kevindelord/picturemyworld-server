#! /usr/bin/env node

const pg = require('pg')
const config = require('../config/config')
const exec = require('child_process').exec; 
const manager = require('../app/postgreManager')

var query = {};

query.insertUser = "INSERT INTO USERS(ID, USERNAME, EMAIL) VALUES (3, 'John Doe', 'test@gmail.com');"

query.insertPost = "INSERT INTO POSTS(ID, TITLE, DESCRIPTION, LOCATION, LAT, LNG, DATE, RATIO)\
								VALUES (1, 'Lovely Title', 'That was good', 'London Bridge', 0.34567, -64.4356, '2017-01-08', 0.75);"


// Connect to existing database and then insert values.
console.log("Connect to PostgreSQL database...")
manager.connect(config.postgre.connectURL, function (client, done) {
	console.log("Poulate database...")
	const queries = [query.insertUser, query.insertPost]
	manager.executeQueries(client, queries, 0, function (client) {
		done()
		process.exit(0)
	})
})