/* eslint-disable consistent-return */
/* eslint-disable func-names */
const jwt = require('jsonwebtoken');


module.exports = function (request, response, next) {
    const token = request.headers.authorization;
    if (!token) {
        return response.status(401).send('Access Denied');
    }

    try {
        const verified = jwt.verify(token, 'secretkey');
        console.log('token is here');
        response.locals.user = verified;
        next();
    } catch (err) {
        console.log('its a bad request!!!');
        response.locals.user = 'unknown';
        next();
        // response.status(400).send('Invalid token');
    }
};
