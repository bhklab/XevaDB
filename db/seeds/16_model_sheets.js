const csv = require('csvtojson');
const path = require('path');
const dataPath = require('../path');


const csvFilePath = path.join(dataPath, 'model_sheets.csv');
const parserParams = {
    delimiter: ',', // optional
    quote: '"', // optional
    ignoreEmpty: true,
};


exports.seed = (knex) => (
    knex('model_sheets').del()
        .then(() => csv(parserParams).fromFile(csvFilePath))
        .then((data) => knex('model_sheets').insert(data))
);
