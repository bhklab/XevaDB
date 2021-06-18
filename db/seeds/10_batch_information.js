const csv = require('csvtojson');
const path = require('path');
const dataPath = require('../path');


const csvFilePath = path.join(dataPath, 'batch_information.csv');
const parserParams = {
    delimiter: ',', // optional
    quote: '"', // optional
    ignoreEmpty: true,
};


exports.seed = (knex) => (
    knex('batch_information').del()
        .then(() => csv(parserParams).fromFile(csvFilePath))
        .then((data) => knex('batch_information').insert(data))
);
