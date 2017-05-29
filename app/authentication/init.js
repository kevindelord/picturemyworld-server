// file:/app/authentication/init.js
'use strict';

const bcrypt                = require('bcryptjs');
const passport              = require('passport');
const LocalStrategy         = require('passport-local').Strategy;
const postgreManager        = require('./../postgreManager');
const config                = require('../../config/config');
const session               = require('express-session');
const authenticationMiddleware = require('./middleware');
const pgSession             = require('connect-pg-simple')(session);

passport.serializeUser(function (user, callback) {
    callback(null, user.username)
})

passport.deserializeUser(function (email, callback) {
    postgreManager.getUserByEmail(email, callback)
})

function verifyUser(username, password, callback) {
    const email = username
    postgreManager.getUserByEmail(email, function (error, user) {
        if (error) {
            return callback(error)
        }
        if (!user) {
            return callback(null, false)
        }
        // Extract the user from [ Anonymous { ... } ]
        user = user[0]
        // Decrypt the local password and compare.
        bcrypt.compare(password, user.password, function(error, result) {
            if (result === true) {
                return callback(null, user)
            } else {
                return callback(null, false)
            }
        });
    });
}

function initPassport (app) {
    passport.use(new LocalStrategy(verifyUser))
    passport.authenticationMiddleware = authenticationMiddleware

    // Documentation: https://github.com/expressjs/session
    // Documentation: https://www.npmjs.com/package/connect-pg-simple
    app.use(session({
        store: new pgSession({ conString: config.postgre.connectURL }),
        secret: config.passport.secretKey,
        resave: false,
        // TODO: investigate more on `saveUninitialized`
        saveUninitialized: false,
        cookie: { maxAge: config.passport.cookieMaxAge },
    }));

    app.use(passport.initialize())
    app.use(passport.session())
}

module.exports = initPassport
