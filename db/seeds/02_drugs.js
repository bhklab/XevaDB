const csv = require('csvtojson');
const path = require('path');
const dataPath = require('../path');


const csvFilePath = path.join(dataPath, 'drugs.csv');
const parserParams = {
    delimiter: ',', // optional
    quote: '"', // optional
    ignoreEmpty: true,
};


exports.seed = (knex) => (
    knex('drugs').del()
        .then(() => csv(parserParams).fromFile(csvFilePath))
        .then((data) => knex('drugs').insert(data))
);
