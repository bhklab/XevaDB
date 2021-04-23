/* eslint-disable consistent-return */
/* eslint-disable func-names */
const jwt = require('jsonwebtoken');


module.exports = function (request, response, next) {
    // authorization token.
    const token = request.headers.authorization;

    // if token is not sent the authorization fails.
    if (!token) {
        return response.status(401).send('Access Denied');
    }

    // check if the token is valid or not.
    try {
        let verified = {};
        verified = jwt.verify(token, 'secretkey');
        verified.verified = 'verified';
        console.log('Token is verified', verified);
        response.locals.user = verified;
        next();
    } catch (err) {
        console.log('Token invalid!!!');
        response.locals.user = 'unknown';
        next();
    }
};
