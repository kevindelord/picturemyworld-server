// file:/app/postgreManager.js
'use strict';

const pg 		= require('pg');
const config 	= require('config');
const sanitizer = require('sanitizer');

// Create a new user with a prepared statement.
function createUser(user, callback) {
	const query = {
		name: 'create-user',
		text: 'INSERT INTO users (email, username, password) VALUES ($1, $2, $3);',
		values: [
			// Sanitize all user inputs.
			sanitizer.sanitize(user.email),
			sanitizer.sanitize(user.username),
			sanitizer.sanitize(user.password)
		]
	};
	executeQueryWithParameters(query, callback);
};

// Fetch a user by its email (unique in DB) with a prepared statement.
// Only the id and the password hash are required as this is an internal call to the DB.
function authentificateUserByEmail(email, callback) {
	const query = {
		name: 'get-user-by-email',
		text: 'SELECT id, email, username, created_at, updated_at, password FROM users WHERE (email = $1);',
		values: [
			// Sanitize all user inputs.
			sanitizer.sanitize(email)
		]
	};
	executeQueryWithParameters(query, callback);
};

// Fetch a user by its identifier (unique in DB) with a prepared statement.
function getUserByIdentifier(identifier, callback) {
	const query = {
		name: 'get-user-by-identifier',
		text: 'SELECT id, email, username, created_at, updated_at FROM users WHERE (id = $1);',
		values: [
			// Sanitize all user inputs.
			sanitizer.sanitize(identifier)
		]
	};
	executeQueryWithParameters(query, callback);
};

// Delete users by their emails (unique in DB) with a prepared statement.
function deleteUsersByEmails(emails, callback) {
	for (var i = 0; i < emails.length; i++) {
		// Sanitize all user inputs.
		emails[i] = sanitizer.sanitize(emails[i])
	};

	const query = {
		name: 'delete-users-by-emails',
		text: 'DELETE FROM users WHERE (email = ANY($1::text[]));',
		values: [
			emails
		]
	};
	executeQueryWithParameters(query, callback);
};

// Delete a post by its id (unique in DB) if it is related to the current user with a prepared statement.
function deletePostForIdentifierAndUser(post_identifier, user_identifier, callback) {
	const query = {
		name: 'delete-post-by-identifier-for-user',
		text: 'DELETE FROM posts WHERE (user_id_fkey = $1 AND id = $2);',
		values: [
			sanitizer.sanitize(user_identifier),
			sanitizer.sanitize(post_identifier)
		]
	};
	executeQueryWithParameters(query, callback);
}

// Delete posts by their ids (unique in DB) with a prepared statement.
function deletePostsForIdentifiers(identifiers, callback) {
	// TODO: test with the GET/READ posts TDD
	for (var i = 0; i < identifiers.length; i++) {
		// Sanitize all user inputs.
		identifiers[i] = sanitizer.sanitize(identifiers[i])
	};

	const query = {
		name: 'delete-posts-by-ids',
		text: 'DELETE FROM posts WHERE (id = ANY($1::text[]));',
		values: [
			identifiers
		]
	};
	executeQueryWithParameters(query, callback);
};

// Delete all posts for user with a prepared statement.
function deleteAllPostsForUserEmail(email, callback) {
	// TODO: test with the GET/READ posts TDD
	const query = {
		name: 'delete-all-posts-for-user',
		text: 'DELETE FROM posts WHERE (user_id_fkey = (SELECT id FROM users WHERE (email = $1)));',
		values: [
			sanitizer.sanitize(email)
		]
	};
	executeQueryWithParameters(query, callback);
};

// Fetch all users with a prepared statement.
function getUsers(callback) {
	const query = {
		name: 'get-users',
		text: 'SELECT id, email, username, created_at, updated_at FROM users;',
		values: []
	};
	executeQueryWithParameters(query, callback);
};

// Fetch all posts with a prepared statement.
function getPosts(callback) {
	const query = {
		name: 'get-posts',
		text: 'SELECT id, title, description, location, lat, lng, date, ratio, created_at, updated_at FROM posts;',
		values: []
	};
	executeQueryWithParameters(query, callback);
};

// Fetch all posts related to a user by its id (unique in DB) with a prepared statement.
function getPostsForUser(user_identifier, callback) {
	const query = {
		name: 'get-posts-by-user-identifier',
		text: 'SELECT id, title, description, location, lat, lng, date, ratio, created_at, updated_at FROM posts WHERE (user_id_fkey = $1);',
		values: [
			sanitizer.sanitize(user_identifier)
		]
	};
	executeQueryWithParameters(query, callback);
};

// Fetch a post with its id (unique in DB) with a prepared statement.
function getPostForIdentifier(identifier, callback) {
	const query = {
		name: 'get-post-by-identifier',
		text: 'SELECT id, title, description, location, lat, lng, date, ratio, created_at, updated_at FROM posts WHERE (id = $1);',
		values: [
			sanitizer.sanitize(identifier)
		]
	};
	executeQueryWithParameters(query, callback);
};

function latestPostForUser(user_identifier, callback) {
	const query = {
		name: 'get-latest-image-post-for-user',
		text: 'SELECT id, title, description, location, lat, lng, date, ratio, created_at, updated_at FROM posts WHERE (user_id_fkey = $1)\
				ORDER BY updated_at DESC LIMIT 1;',
		values: [
			sanitizer.sanitize(user_identifier)
		]
	};
	executeQueryWithParameters(query, callback);
};

// Create a new image post with a prepared statement.
function createPost(post, image, user_identifier, callback) {
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
module.exports.authentificateUserByEmail = authentificateUserByEmail;
module.exports.deleteUsersByEmails = deleteUsersByEmails;
module.exports.createPost = createPost;
module.exports.connectURL = connectURL;
module.exports.deleteAllPostsForUserEmail = deleteAllPostsForUserEmail;
module.exports.deletePostsForIdentifiers = deletePostsForIdentifiers;
module.exports.getPostForIdentifier = getPostForIdentifier;
module.exports.deletePostForIdentifierAndUser = deletePostForIdentifierAndUser;
module.exports.getPostsForUser = getPostsForUser;
module.exports.getUserByIdentifier = getUserByIdentifier;
module.exports.latestPostForUser = latestPostForUser;
