const csv = require('csvtojson');
const path = require('path');
const dataPath = require('../path');


const csvFilePath = path.join(dataPath, 'batch_response.csv');
const parserParams = {
    delimiter: ',', // optional
    quote: '"', // optional
    ignoreEmpty: true,
};


exports.seed = (knex) => (
    knex('batch_response').del()
        .then(() => csv(parserParams).fromFile(csvFilePath))
        .then((data) => knex('batch_response').insert(data))
);
