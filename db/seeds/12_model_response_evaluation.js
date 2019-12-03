const csv = require('csvjson');
const fs = require('fs');
const path = require('path');

const file_location = path.join(__dirname, '../../data_conversion/Final_csv_file/model_model_response_final.csv');

const file = fs.readFileSync(file_location, 'utf8');
const dataObj = csv.toObject(file);


exports.seed = function (knex, Promise) {
    return knex('model_response').del()
        .then(() => {
          return knex('model_response').insert(dataObj);
        });
};
