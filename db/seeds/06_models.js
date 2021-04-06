const csv = require('csvjson')
const fs = require('fs')
const data_path = require('../path')

const options = {
  delimiter: ',', // optional
  quote: '"', // optional
};

const file_location = `${data_path}/models.csv`

const file = fs.readFileSync(file_location, 'utf8')
const dataObj = csv.toObject(file, options)


exports.seed = function (knex, Promise) {
  return knex('models').del()
    .then(function () {
      return knex('models').insert(dataObj);
    });
};