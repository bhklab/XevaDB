const csv = require('csvjson')
const fs = require('fs')
const data_path = require('../path')

const options = {
  delimiter: ',', // optional
  quote: '"', // optional
};

const file_location = `${data_path}/genes.csv`

const file = fs.readFileSync(file_location, 'utf8')
const dataObj = csv.toObject(file, options)


exports.seed = function (knex, Promise) {
  return knex('genes').del()
    .then(function () {
      return knex('genes').insert(dataObj);
    });
};