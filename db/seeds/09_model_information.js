const csv = require('csvjson')
const fs = require('fs')
const data_path = require('../path')

const file_location = `${data_path}/model_information.csv`

const file = fs.readFileSync(file_location, 'utf8')
const dataObj = csv.toObject(file)


exports.seed = function (knex, Promise) {
  return knex('model_information').del()
    .then(function () {
      return knex('model_information').insert(dataObj);
    });
};
