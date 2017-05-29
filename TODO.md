# TODO

## Node.js Server

### Script to setup and configure database
- [x] One script to create the database, tables and columns.
- [x] One script to populate the database with mockup data.
- [x] To remove the database.

### User connections
- [x] Properly register users with passwords and sessions.
- [x] Sign in users with passwords.
- [x] Logout users.

### Script
- [x] Create session table from `createDB` script.
- [x] Script to migrate old website posts into the new database.

### Database update
- [x] Post should have a unique UUID as well as the users.
- [ ] Link a post to a user in database.
- [ ] GET posts endpoint should only return the post of the current user.

### WS update
- [ ] The GET posts endpoint should return all post information.
- [ ] Add POST posts endpoint to create a new post.

### Photo management
- [ ] Retrieve uploaded photo and store them on disk.
- [ ] Integrate AWS to store photos.
- [ ] Integrate ImageShack or related to shrink photos (original/large/thumb).

## Webapp
- [ ] What to use for the frontend?
- [ ] Create sign in page.
- [ ] Create register page.
- [ ] Create basic index page.
- [ ] Integrate search bar to search for users.
- [ ] Create dedicated user page.

## iOS
- [ ] Create user management sessions.
- [ ] Integrate custom user pages.
