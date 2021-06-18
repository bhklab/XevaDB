const csv = require('csvtojson');
const path = require('path');
const dataPath = require('../path');


const csvFilePath = path.join(dataPath, 'datasets.csv');
const parserParams = {
    delimiter: ',', // optional
    quote: '"', // optional
    ignoreEmpty: true,
};


exports.seed = (knex) => (
    knex('datasets').del()
        .then(() => csv(parserParams).fromFile(csvFilePath))
        .then((data) => knex('datasets').insert(data))
);
