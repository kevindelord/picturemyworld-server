// file:/app/user/init.js
'use strict';

const passport = require('passport')

function initUser (app) {
    app.get('/', renderWelcome)
    app.get('/profile', passport.authenticationMiddleware(), renderProfile)
    app.post('/login', 
        passport.authenticate('local', {
        // passport.authenticate('local'),
        // function(request, result) {
        //     console.log("init user stuff ")
        //     console.log(request)
        //     console.log(result)

            successRedirect: '/profile',
            failureRedirect: '/'
        // }
    }))
}

function renderWelcome (request, response) {
    response.render('welcome')
}

function renderProfile (request, response) {
    response.render('profile', {
        username: request.user.username
    })
}

module.exports = initUser
