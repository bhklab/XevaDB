const session = require('express-session');
const Keycloak = require('keycloak-connect');
const keycloakConfig = require('./keycloak.json');

const memoryStore = new session.MemoryStore();

// Configure session
app.use(
    session({
        secret: 'mySecret',
        resave: false,
        saveUninitialized: true,
        store: memoryStore,
    })
);

const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);
