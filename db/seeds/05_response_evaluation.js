const csv = require ('csvjson')
const fs = require ('fs')
const path = require('path')

const file_location = path.join(__dirname, '../../data_conversion/Final_Csv_File/response_evaluation_final.csv')

const file = fs.readFileSync(file_location , 'utf8')
const dataObj = csv.toObject(file)

console.log("Hey5"); 

exports.seed = function(knex, Promise) {
  return knex('response_evaluation').del()
        .then(function() {
          return knex('response_evaluation').insert(dataObj);
        });
};