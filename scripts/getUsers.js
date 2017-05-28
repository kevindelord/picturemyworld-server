#! /usr/bin/env node

const pg = require('pg')
const config = require('../config/config')

pg.connect(config.postgre.connectURL, function (error, client, done) {
	if (error) {
		console.log(`ERROR: ${error}`)
	}

	client.query("SELECT * FROM users", function (error, result) {
		done()

		if (error) {
			console.log(`ERROR: ${error}`)
		} else {
			console.log(result.rows)
		}
		// Exit the script once it is done.
		process.exit(0)
	})
})