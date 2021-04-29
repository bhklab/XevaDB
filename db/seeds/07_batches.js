const csv = require('csvtojson');
const path = require('path');
const dataPath = require('../path');


const csvFilePath = path.join(dataPath, 'batches.csv');
const parserParams = {
    delimiter: ',', // optional
    quote: '"', // optional
    ignoreEmpty: true,
};


exports.seed = (knex) => (
    knex('batches').del()
        .then(() => csv(parserParams).fromFile(csvFilePath))
        .then((data) => knex('batches').insert(data))
);
