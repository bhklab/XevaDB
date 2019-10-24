const jwt = require('jsonwebtoken')

module.exports = function (request, response, next) {
    const token = request.header('auth-token')
    if(!token) {
        return response.status(401).send('Access Denied')
    }

    try{
        const verified = jwt.verify(token, 'secretkey')
        request.user = verified;
        next()
    } catch (err) {
        response.status(400).send('Invalid token')
    }
}