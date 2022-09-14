/* eslint-disable no-console */
const request = require('request');
const keycloakConfig = require('./keycloak.json');

const USER_INFO_URL = `${keycloakConfig['auth-server-url']}/realms/${keycloakConfig.realm}/protocol/openid-connect/userinfo`;

// check each request for a valid bearer token
module.exports = (req, res, next) => {
    // assumes bearer token is passed as an authorization header
    if (req.headers.authorization) {
        // configure the request to your keycloak server
        const options = {
            method: 'GET',
            url: `${USER_INFO_URL}`,
            headers: {
                // add the token you received to the userinfo request, sent to keycloak
                Authorization: req.headers.authorization,
            },
        };

        // send a request to the userinfo endpoint on keycloak
        request(options, (error, response) => {
            if (error) throw new Error(error);

            // if the request status isn't "OK", the token is invalid
            if (response.statusCode !== 200) {
                console.log('Authorization Token is invalid!!!');
                res.locals.user = 'unauthorized user';
                next();
            } else { // the token is valid pass request onto your next function
                res.locals.user = 'authorized user';
                next();
            }
        });
    } else {
        // send 'unauthorized user' text to next function call
        console.log('Authorization Token is invalid!!!');
        res.locals.user = 'unauthorized user';
        next();
    }
};
