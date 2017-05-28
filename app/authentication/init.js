// file:/app/authentication/init.js
'use strict';

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const postgreManager = require('./../postgreManager')
const config = require('../../config/config')
const session = require('express-session')

passport.serializeUser(function (user, callback) {
    console.log('serializeUser')
    console.log(user)
    callback(null, user.username)
})

passport.deserializeUser(function (email, callback) {
    postgreManager.getUserByEmail(email, callback)
})

function authenticationMiddleware () {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        res.redirect('/')
    }
}

function verifyUser(username, password, done) {
    console.log(username)
    console.log(password)
    return done(null, false)
    // postgreManager.getUserByEmail(email, function (err, user) {
    //     if (err) {
    //         return done(err)
    //     }
    //     if (!user) {
    //         return done(null, false)
    //     }
    //     if (password !== user.password) {
    //         return done(null, false)
    //     }
    //     return done(null, user)
    // })
}

function initPassport (app) {
    passport.use(new LocalStrategy(verifyUser))
    passport.authenticationMiddleware = authenticationMiddleware

    // Documentation: https://github.com/expressjs/session
    app.use(session({
        secret: config.passport.secretKey,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 60000 }
    }))
    app.use(passport.initialize())
    app.use(passport.session())
}

module.exports = initPassport
module.exports = authenticationMiddleware
