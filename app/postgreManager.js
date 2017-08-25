// file:/app/postgreManager.js
'use strict';

const pg 		= require('pg');
const config 	= require('config');
const sanitizer = require('sanitizer');

// Create a new user with a prepared statement. 
function createUser(user, callback) {
	const query = {
		name: 'create-user',
		text: 'INSERT INTO users (email, username, password)\
		VALUES ($1, $2, $3)',
		values: [
			// Sanitize all user inputs.
			sanitizer.sanitize(user.email),
			sanitizer.sanitize(user.username),
			sanitizer.sanitize(user.password)
		]
	};
	executeQueryWithParameters(query, callback);
}

// Fetch a user by its email (unique in DB) with a prepared statement.
function getUserByEmail(email, callback) {
	const query = {
		name: 'get-user-by-email',
		text: 'SELECT id, password FROM users WHERE (email = $1)',
		values: [
			// Sanitize all user inputs.
			sanitizer.sanitize(email)
		]
	};
	executeQueryWithParameters(query, callback);
}

// Delete a user by its email (unique in DB) with a prepared statement.
function deleteUsersByEmails(emails, callback) {
	for (var i = 0; i < emails.length; i++) {
		// Sanitize all user inputs.
		emails[i] = sanitizer.sanitize(emails[i])
	};

	const query = {
		name: 'delete-users-by-emails',
		text: 'DELETE FROM users WHERE (email = ANY($1::text[]))',
		values: [
			emails
		]
	};
	executeQueryWithParameters(query, callback);
}

// Fetch all users with a prepared statement.
function getUsers(callback) {
	const query = {
		name: 'get-users',
		text: 'SELECT email, username, created_at, updated_at FROM users',
		values: []
	};
	executeQueryWithParameters(query, callback);
}

// Fetch all posts with a prepared statement.
function getPosts(callback) {
	const query = {
		name: 'get-posts',
		text: 'SELECT title, description, location, lat, lng, date, ratio, created_at, updated_at FROM posts',
		values: []
	};
	executeQueryWithParameters(query, callback);
}

// Create a new image post with a prepared statement. 
function createImagePost(post, image, user_identifier, callback) {
	const query = {
		name: 'create-image-post',
		text: 'WITH post_key AS (\
					INSERT INTO posts (title, description, location, lat, lng, date, ratio, user_id_fkey)\
					VALUES ($1, $2, $3, $4, $5, $6, $7, $8)\
					RETURNING id\
				)\
				INSERT INTO images (original_name, field_name, encoding, mimetype, destination, filename, path, size, user_id_fkey, post_id_fkey)\
					SELECT $9, $10, $11, $12, $13, $14, $15, $16, $17, post_key.id\
					FROM post_key;',
		values: [
			// Sanitize all user inputs.
			// Post data
			sanitizer.sanitize(post.title),
			sanitizer.sanitize(post.description),
			sanitizer.sanitize(post.location),
			sanitizer.sanitize(post.lat),
			sanitizer.sanitize(post.lng),
			sanitizer.sanitize(post.date),
			sanitizer.sanitize(post.ratio),
			sanitizer.sanitize(user_identifier),
			// Image data
			sanitizer.sanitize(image.originalname), // Multer and the database have a different naming convention.
			sanitizer.sanitize(image.fieldname), // Multer and the database have a different naming convention.
			sanitizer.sanitize(image.encoding),
			sanitizer.sanitize(image.mimetype),
			sanitizer.sanitize(image.destination),
			sanitizer.sanitize(image.filename),
			sanitizer.sanitize(image.path),
			sanitizer.sanitize(image.size),
			sanitizer.sanitize(user_identifier)
		]
	};
	executeQueryWithParameters(query, callback);
}

function connectURL() {
	return `postgres://${config.get("postgre.user")}:${config.get("postgre.password")}@${config.get("postgre.host")}/${config.get("postgre.database")}`;
}

// Execute a query with a prepared statement.
function executeQueryWithParameters(query, callback) {
	// Connect to the database using the configured username, host and database name.
	// Create a pool
	var pool = new pg.Pool({
		connectionString: connectURL()
	});
	// Connection using created pool
	pool.connect(function (error, client, done) {
		if (error) {
			return callback(error)
		}
		// Execute the query.
		client.query(query, function (error, result) {
			// Close the pg client.
			done();
			if (error) {
				return callback(error);
			} else {
				return callback(null, result.rows);
			}
		});
	});
	// Pool shutdown
	pool.end();
}

module.exports.createUser = createUser;
module.exports.getUsers = getUsers;
module.exports.getPosts = getPosts;
module.exports.getUserByEmail = getUserByEmail;
module.exports.deleteUsersByEmails = deleteUsersByEmails;
module.exports.createImagePost = createImagePost;
module.exports.connectURL = connectURL;
