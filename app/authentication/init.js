// file:/app/authentication/init.js
'use strict';

const bcrypt                = require('bcryptjs');
const passport              = require('passport');
const LocalStrategy         = require('passport-local').Strategy;
const postgreManager        = require('./../postgreManager');
const config                = require('config');
const session               = require('express-session');
const authenticationMiddleware = require('./middleware');
const pgSession             = require('connect-pg-simple')(session);

function verifyUser(email, password, callback) {
    postgreManager.getUserByEmail(email, function (error, user) {
        if (error) {
            return callback(error); // Unknown error
        }
        if (!user || user.length == 0) {
            return callback(null, false);
        }
        // Extract the user from [ Anonymous { ... } ]
        user = user[0];
        // Decrypt the local password and compare.
        bcrypt.compare(password, user.password, function(error, result) {
            if (result === true) {
                return callback(null, user);
            } else {
                return callback(null, false);
            }
        });
    });
}

function initPassport (app) {
    passport.use(new LocalStrategy(verifyUser))
    passport.authenticationMiddleware = authenticationMiddleware
    // Documentation: https://github.com/expressjs/session
    // Documentation: https://www.npmjs.com/package/connect-pg-simple
    const cookieMaxAge = (config.get("passport.cookieMaxAgeInDays") * 24 * 60 * 60 * 1000); // In seconds
    app.use(session({
        store: new pgSession({ conString: postgreManager.connectURL() }),
        secret: config.get("passport.secretKey"),
        // TODO: investigate more on `saveUninitialized` and `resave`
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: cookieMaxAge },
    }));

    app.use(passport.initialize());
    app.use(passport.session());
}

module.exports = initPassport;
