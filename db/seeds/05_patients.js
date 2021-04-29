const csv = require('csvtojson');
const path = require('path');
const dataPath = require('../path');


const csvFilePath = path.join(dataPath, 'patients.csv');
const parserParams = {
    delimiter: ',', // optional
    quote: '"', // optional
    ignoreEmpty: true,
};


exports.seed = (knex) => (
    knex('patients').del()
        .then(() => csv(parserParams).fromFile(csvFilePath))
        .then((data) => knex('patients').insert(data))
);
