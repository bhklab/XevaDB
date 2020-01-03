/* eslint-disable consistent-return */
/* eslint-disable func-names */
const jwt = require('jsonwebtoken');


module.exports = function (request, response, next) {
    const token = request.headers.authorization;

    if (!token) {
        return response.status(401).send('Access Denied');
    }

    try {
        let verified = {};
        verified = jwt.verify(token, 'secretkey');
        verified.verified = 'verified';
        console.log('Token is verified', verified);
        response.locals.user = verified;
        next();
    } catch (err) {
        console.log('Access denied, token invalid!!!');
        response.locals.user = 'unknown';
        next();
        // response.status(400).send('Invalid token');
    }
};
