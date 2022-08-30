const session = require('express-session');
const Keycloak = require('keycloak-connect');
const keycloakConfig = require('./keycloak.json');


function initKeycloak() {
    const memoryStore = new session.MemoryStore();

    return keycloak = new Keycloak({
        store: memoryStore,
        secret: 'mySecret',
        resave: false,
        saveUninitialized: true,
        store: memoryStore,
    }, keycloakConfig);
}


module.exports = {
    initKeycloak,
}
