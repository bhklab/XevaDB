const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const path = require('path');
// const cors = require('cors');
const logger = require('morgan');
const knexLogger = require('knex-logger');
const db = require('./db/knex1');

const tokenValidation = require('./keycloak/keycloakTokenValidation');

// keycloak
const keycloak = require('./keycloak/keycloak').initKeycloak();

app.use(keycloak.middleware());

// setting the path of the router file to variable so that we can use all the routes from it.
const router = require('./routes/router');

// Bodyparser Middleware
app.use(bodyParser.json());

// logging
app.use(logger('dev'));
app.use(knexLogger(db));

// app.use(cors({origin: 'http://localhost:3000'}));

// use token validation on each incoming API request.
app.use(tokenValidation);

// this will set/use our api to initial path of /api.
app.use('/api', router);

// use 5000 port no. for server.
const port = process.env.PORT || 5000;

// build to serve static files.
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/*', (req, res) => {
    res.sendFile('index.html', { root: './client/build' });
});

app.listen(port, () => {
    console.log('Server Started');
});
