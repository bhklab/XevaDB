const csv = require('csvjson');
const fs = require('fs');
const data_path = require('../path')

const options = {
    delimiter: ',', // optional
    quote: '"', // optional
};

const file_location = `${data_path}/batch_response.csv`

const file = fs.readFileSync(file_location, 'utf8');
const dataObj = csv.toObject(file, options);


exports.seed = function (knex, Promise) {
    return knex('batch_response').del()
        .then(() => knex('batch_response').insert(dataObj));
};
