const csv = require('csvtojson');
const path = require('path');
const dataPath = require('../path');


const csvFilePath = path.join(dataPath, 'drug_annotations.csv');
const parserParams = {
    delimiter: ',', // optional
    quote: '"', // optional
    ignoreEmpty: true,
};


exports.seed = (knex) => (
    knex('drug_annotations').del()
        .then(() => csv(parserParams).fromFile(csvFilePath))
        .then((data) => knex('drug_annotations').insert(data))
);
