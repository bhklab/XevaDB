const knex = require('../../db/knex1');
const jwt = require('jsonwebtoken')


const createPosts = function(request, response) {
    // verify a token symmetric
    jwt.verify(request.token, 'secretkey', function(err, authData) {
        if(err) {
            response.sendStatus(403)
        } else {
            response.json({
                message: 'hahahahhahaha',
                authData
            });
        }
    });
}


const createLogin = function(request, response) {
    // Mock User
    const user = {
        username: 'bhklab'
    }

    jwt.sign({user: user}, 'secretkey', {expiresIn: '60s'}, (err, token) => {
        response.json({
            token: token
        });
    })
}


//verify token
const verifyToken = function(request, response, next) {
    // Get auth header value
    const bearerHeader = request.headers['authorization']
    // check is undefined
    if(typeof bearerHeader !== 'undefined') {
        //split at space
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        request.token = bearerToken
        next()
    } else {
        response.sendStatus(403)
    }
}


//register user
const createRegister = function(request, response) {
    response.json({
        message: 'register it'
    });
}


module.exports = {
    createLogin,
    createPosts,
    verifyToken,
    createRegister
}