// file:/app/index.js
'use strict';

const express 		= require('express');
const bodyParser 	= require('body-parser');
const config 		= require('config');
const app 			= express();

const environment 	= config.util.getEnv('NODE_ENV');
const configured 	= ["development", "test", "staging", "production"]
if (!environment || configured.includes(environment) == false) {
	console.log(`\nInvalid Node environment. Please use one of the following:`);
	configured.forEach(function(element) {
		console.log(`- ${element}`);
	});
	// Stop the server
	return
}

// Use BodyParser to parse the body of a request
app.use(bodyParser.urlencoded({extended: false}));

// Init authentication through Passportjs.
require('./authentication').init(app);

// Setup basic html views
require('./views').init(app);

// Setup endpoints.
require('./users').init(app);
require('./posts').init(app);
require('./user').init(app);

app.listen(config.get("express.port"), (error) => {
	if (error) {
		// Stop the server
		return console.log('Something bad happened', error);
	}
	console.log(`Server starting in '${environment}', now listening on port ${config.express.port}`);
});

// Export the server (app) for testing purposes.
module.exports = app;
