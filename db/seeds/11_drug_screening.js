const csv = require('csvtojson');
const path = require('path');
const dataPath = require('../path');


const csvFilePath = path.join(dataPath, 'drug_screening.csv');
const parserParams = {
    delimiter: ',', // optional
    quote: '"', // optional
    ignoreEmpty: true,
};


exports.seed = (knex) => (
    knex('drug_screening').del()
        .then(() => csv(parserParams).fromFile(csvFilePath))
        .then((data) => knex('drug_screening').insert(data))
);
