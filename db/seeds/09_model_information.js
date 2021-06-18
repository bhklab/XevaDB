const csv = require('csvtojson');
const path = require('path');
const dataPath = require('../path');


const csvFilePath = path.join(dataPath, 'model_information.csv');
const parserParams = {
    delimiter: ',', // optional
    quote: '"', // optional
    ignoreEmpty: true,
};


exports.seed = (knex) => (
    knex('model_information').del()
        .then(() => csv(parserParams).fromFile(csvFilePath))
        .then((data) => knex('model_information').insert(data))
);
