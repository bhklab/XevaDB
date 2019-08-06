const csv = require ('csvjson')
const fs = require ('fs')
const path = require('path')

const file_location = path.join(__dirname, '../../data_conversion/Final_Csv_File/dataset_final.csv')

const file = fs.readFileSync(file_location , 'utf8')
const dataObj = csv.toObject(file)

console.log(dataObj);

exports.seed = function(knex, Promise) {
  return knex('datasets').del()
        .then(function() {
          return knex('datasets').insert(dataObj);
        });
};