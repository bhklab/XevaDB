const csv = require('csvtojson');
const path = require('path');
const dataPath = require('../path');


const csvFilePath = path.join(dataPath, 'modelid_moleculardata_mapping.csv');
const parserParams = {
    delimiter: ',', // optional
    quote: '"', // optional
    ignoreEmpty: true,
};


exports.seed = (knex) => (
    knex('modelid_moleculardata_mapping').del()
        .then(() => csv(parserParams).fromFile(csvFilePath))
        .then((data) => knex('modelid_moleculardata_mapping').insert(data))
);
