const csv = require('csvtojson');
const path = require('path');
const dataPath = require('../path');


const csvFilePath = path.join(dataPath, 'genes.csv');
const parserParams = {
    delimiter: ',', // optional
    quote: '"', // optional
    ignoreEmpty: true,
};


exports.seed = (knex) => (
    knex('genes').del()
        .then(() => csv(parserParams).fromFile(csvFilePath))
        .then((data) => knex('genes').insert(data))
);
