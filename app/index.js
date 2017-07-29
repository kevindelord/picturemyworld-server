// file:/app/index.js
'use strict';

const express 		= require('express');
const bodyParser 	= require('body-parser');
const config 		= require('config');
const app 			= express();

const environment = config.util.getEnv('NODE_ENV')
if (!environment || (environment != "development" || environment != "production")) {
	return console.log("Invalid Node environment. Please use one of the following:\n- 'development'\n- 'production'");
}

// Documentation: https://www.npmjs.com/package/body-parser
// Use BodyParser to parse the body of a request
// TODO: urlencoded extended or not?
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
		return console.log('something bad happened', error);
	}
	console.log(`server is listening on ${config.express.port}`);
})
