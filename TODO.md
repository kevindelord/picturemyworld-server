# TODO

## Node.js Server

### General
- [x] Use node-config and process.env variables.
- [x] Setup script to install npm dependencies, missing folders and other third parties softwares.
- [x] Use semi-columns everywhere.
- [ ] Script to generate config file.
- [ ] Check if server instance is not already running.

### User connections
- [x] Properly register users with passwords and sessions.
- [x] Sign in users with passwords.
- [x] Logout users.
- [ ] Express: urlencoded extended or not?

### Script
- [x] One script to create the database, tables and columns.
- [x] One script to populate the database with mockup data.
- [x] One Script to remove the database.
- [x] Create session table from `createDB` script.
- [x] Script to migrate old website posts into the new database.
- [x] Update `populateDB` script to create post by users.

### Database update
- [x] Post should have a unique UUID as well as the users.
- [x] Link a post to a user in database.
- [x] GET posts endpoint should only return the post of the current user (for now).
- [x] Add created_at to USERS and POSTS tables.
- [x] Add uploaded_at to USERS and POSTS tables.
- [x] Use lower_case (system might or might not be case sensitive).
- [x] Sanitise ALL user input (post data, login credentials, etc).
- [x] Use Prepared Statement for all SQL request.
- [ ] Make sure the DB is not reachable from the outside, so no one can even try to connect. It should only accept connections from localhost (if it runs on the same machine).
- [ ] Use public and private identifiers for objects?
- [ ] PostgreSql: investigate more on `saveUninitialized` and `resave`

### API update
- [x] The GET posts endpoint should return all post information.
- [x] Add POST posts endpoint to create a new post.
- [x] Create Image model object and integrate into API.
- [ ] Create GET posts for a given user.
- [ ] Most GET endpoint should not require a logged in session.

### Login
- [ ] The login parameter should be 'email' not 'username'.
- [ ] Forgot password feature.
- [ ] Integrate Facebook login.
- [ ] Integrate Google login.

### Photo management
- [x] Retrieve uploaded photo and store them on disk.
- [x] Multer-Filter: Force upload to only image file.
- [x] Force endpoint to receive image object.
- [x] Add image size limit on upload to 10mb.
- [ ] Integrate AWS to store photos.
- [ ] Integrate ImageShack or related to shrink photos (original/large/thumb).

## Documentation
- [ ] Github: create API documentation page
### User Posts
- [ ] Endpoint: GET posts
- [ ] Endpoint: POST post
### User Sessions
- [ ] Endpoint: POST login
- [ ] Endpoint: GET logout
- [ ] Endpoint: GET profile ?
### User accounts
- [ ] Endpoint: POST users
- [ ] Endpoint: GET users
