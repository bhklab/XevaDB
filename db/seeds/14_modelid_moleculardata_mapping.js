const csv = require('csvjson');
const fs = require('fs');
const data_path = require('../path')

const file_location = `${data_path}/modelid_moleculardata_mapping.csv`


const file = fs.readFileSync(file_location, 'utf8');
const dataObj = csv.toObject(file);


exports.seed = function (knex, Promise) {
  return knex('modelid_moleculardata_mapping').del()
    .then(() => {
      return knex('modelid_moleculardata_mapping').insert(dataObj);
    });
};
