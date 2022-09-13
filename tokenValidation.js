const request = require('request');

// check each request for a valid bearer token
module.exports = (req, res, next) => {
    console.log('-------------token-----------', req.headers.authorization);

    // assumes bearer token is passed as an authorization header
    if (req.headers.authorization) {
        // configure the request to your keycloak server
        const options = {
            method: 'GET',
            url: 'http://localhost:8080/realms/xevadb-realm/protocol/openid-connect/userinfo',
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
                res.status(401).json({
                    error: 'unauthorized',
                });
            } else { // the token is valid pass request onto your next function
                next();
            }
        });
    } else {
        // there is no token, don't process request further
        res.status(401).json({
            error: 'unauthorized',
        });
    }
};
