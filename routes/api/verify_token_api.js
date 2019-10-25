const jwt = require('jsonwebtoken')


module.exports = function (request, response, next) {
    const token = request.headers.authorization
    if(!token) {
        return response.status(401).send('Access Denied')
    }

    try{
        const verified = jwt.verify(token, 'secretkey')
        response.locals.user = verified;
        next()
    } catch (err) {
        response.status(400).send('Invalid token')
    }
}