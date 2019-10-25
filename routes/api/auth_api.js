const knex = require('../../db/knex1');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')



//VALIDATION
const Joi = require('@hapi/joi');
const schema = Joi.object({
    username: Joi.string().min(6).required(),
    password: Joi.string().min(6).required()
})


//Register User
const createRegister = async (request, response) => {
    const username = request.body.username
    const password = request.body.password

    //validate a user.
    const {error} = schema.validate({username: username, password: password})
    if(error) return response.status(400).send(error.details[0].message)

    // hash the password.
    let salt = ''
    let hashPassword = ''
    async function hashpass() {
        salt = await bcrypt.genSalt(10);
        hashPassword = await bcrypt.hash(request.body.password, salt)
    }
    hashpass()

    //checking if the user is already in there.
    knex.select()
        .from('users')
        .where('user_name', username)
        .then(data => {
            if(JSON.parse(JSON.stringify(data)).length > 0) {
                return response.status(400).send('Username Exists.')
            } else {
                console.log(hashPassword)
                // create a new user.
                knex('users')
                    .insert({
                        user_name: username,
                        user_pwd: hashPassword
                    })
                    .then((data) => {
                        knex.select('user_id')
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


// Create Login
const createLogin = function(request, response) {
    const username = request.body.username
    const password = request.body.password
    
    //validate a user.
    const {error} = schema.validate({username: username, password: password})
    if(error) return response.status(400).send(error.details[0].message)

    //checking if the user is already in there.
    knex.select()
        .from('users')
        .where('user_name', username)
        .then(data => {
            if(!(JSON.parse(JSON.stringify(data)).length > 0)) {
                return response.status(400).send('Username or Password is incorrect')
            } else {
                //validate password
                //console.log(JSON.parse(JSON.stringify(data))[0]['user_pwd'])
                let validPass = ''
                async function checkValidPass() {
                   validPass = await bcrypt.compare(request.body.password, data[0].user_pwd)
                   if(!validPass) return response.status(400).send('Invalid password')
                   else {
                        //Create and assign token.
                        const token = jwt.sign({username: data[0].user_id}, 'secretkey')
                        response.header('auth-token', token).send(token)
                   }
                }
                checkValidPass()
            }
        })
}



module.exports = {
    createLogin,
    createRegister
}