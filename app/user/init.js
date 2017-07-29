// file:/app/user/init.js
'use strict';

const passport = require('passport');

function initUser (app) {

    app.post('/login', passport.authenticate('local', { failureFlash: true } ), function (request, response) {
        return response.status(200).json({"status": 200, "message": "success"});
    });

    app.get('/logout', function(request, response) {
        request.logout();
        return response.status(200).json({"status": 200, "message": "successfully logged out"});
    });
}

module.exports = initUser
