#! /usr/bin/env node
'use strict';

const config 	= require('../config/config')
const manager 	= require('./postgreManager')
const bcrypt 	= require('bcryptjs');

var passwordHash = bcrypt.hashSync('superpass', config.bcrypt.seendLength);

var query = {};
query.insertUser = `INSERT INTO USERS(USERNAME, EMAIL, PASSWORD) VALUES ('John Doe', 'test@gmail.com', '${passwordHash}');`
query.insertPost = "INSERT INTO POSTS(TITLE, DESCRIPTION, LOCATION, LAT, LNG, DATE, RATIO)\
								VALUES ('Lovely Title', 'That was good', 'London Bridge', 0.34567, -64.4356, '2017-01-08', 0.75);\
					INSERT INTO POSTS(TITLE, DESCRIPTION, LOCATION, LAT, LNG, DATE, RATIO)\
								VALUES ('Secondary Post', 'May the force be with you', 'Colombia', 4.34567, -4.4356, '2017-01-10', 1.33);"

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
