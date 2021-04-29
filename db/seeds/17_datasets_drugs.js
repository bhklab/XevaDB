const csv = require('csvtojson');
const path = require('path');
const dataPath = require('../path');


const csvFilePath = path.join(dataPath, 'datasets_drugs.csv');
const parserParams = {
    delimiter: ',', // optional
    quote: '"', // optional
    ignoreEmpty: true,
};


exports.seed = (knex) => (
    knex('datasets_drugs').del()
        .then(() => csv(parserParams).fromFile(csvFilePath))
        .then((data) => knex('datasets_drugs').insert(data))
);
