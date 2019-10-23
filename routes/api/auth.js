const knex = require('../../db/knex1');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

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


//VALIDATION
const Joi = require('@hapi/joi');
const schema = Joi.object({
    username: Joi.string().min(6).required(),
    password: Joi.string().min(6).required()
})

//register user
const createRegister = async (request, response) => {
    const username = request.body.username
    const password = request.body.password

    //validate a user.
    const {error} = schema.validate({username: username, password: password})
    if(error) return response.status(400).send(error.details[0].message)

    // hash the password.
    async() => {
        
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(request.body.password, salt)

    //checking if the user is already in there.
    knex.select()
        .from('users')
        .where('user_name', username)
        .then(data => {
            if(JSON.parse(JSON.stringify(data)).length > 0) {
                return response.status(400).send('Username Exists.')
            } else {
                // create a new user.
                knex('users')
                    .insert({
                        user_name: username,
                        user_pwd: password
                    })
                    .then((data) => {
                        knex.select()
                            .from('users')
                            .where({
                                user_id: data[0]
                            })
                            .then((data) => response.status(200).json({
                                status: 'success',
                                data: data
                            }))
                    })
                    .catch((error) => response.status(500).json({
                        status: 'could not find data from batch table, getBatches',
                        data: error
                    }))
            }
        })
}


module.exports = {
    createLogin,
    createPosts,
    verifyToken,
    createRegister
}