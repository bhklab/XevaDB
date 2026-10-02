/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable func-names */
const jwt = require('jsonwebtoken');

/**
 * @param {Object} request - request object with authorization header.
 * @param {Object} response - response object.
 * @param {Object} next - calls the next function with user payload.
 */
module.exports = function (request, response, next) {
    // authorization token.
    const token = request.headers.authorization;

    // if token is not sent the authorization fails.
    if (!token) {
        return response.status(401).send('Access Denied, missing authorization token!');
    }

    // check if the token is valid or not.
    // jwt.verify checks the signature against the secret in the .env file (JWT_SECRET)
    // and rejects tokens that have expired.
    try {
        let verified = {};
        verified = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
        verified.verified = 'verified';
        console.log('Token is verified for user', verified.username);
        response.locals.user = verified;
        next();
    } catch (err) {
        // treat the request as a logged-out user.
        console.log('Token invalid!!!');
        response.locals.user = 'unknown';
        next();
    }
};
