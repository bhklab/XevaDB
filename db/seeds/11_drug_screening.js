const csv = require('csvjson')
const fs = require('fs')
const data_path = require('../path')

const file_location = `${data_path}/drug_screening.csv`

const file = fs.readFileSync(file_location, 'utf8')
const dataObj = csv.toObject(file)

console.log(dataObj);

exports.seed = function (knex, Promise) {
  return knex('drug_screening').del()
    .then(function () {
      return knex('drug_screening').insert(dataObj);
    });
};
