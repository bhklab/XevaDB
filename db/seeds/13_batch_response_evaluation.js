const csv = require('csvjson');
const fs = require('fs');
const path = require('path');

const file_location = path.join(__dirname, '../../data_conversion/Final_Csv_File/batch_response_final.csv');

const file = fs.readFileSync(file_location, 'utf8');
const dataObj = csv.toObject(file);


exports.seed = function (knex, Promise) {
    return knex('model_response').del()
        .then(() => knex('model_response').insert(dataObj));
};
