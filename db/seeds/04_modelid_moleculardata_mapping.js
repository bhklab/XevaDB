const csv = require ('csvjson')
const fs = require ('fs')
const path = require('path')

const file_location = path.join(__dirname, '../../data_conversion/Final_Csv_File/modelid_moleculardata_mapping_final.csv')

const file = fs.readFileSync(file_location , 'utf8')
const dataObj = csv.toObject(file)


exports.seed = function(knex, Promise) {
  return knex('modelid_moleculardata_mapping').del()
        .then(function() {
          return knex('modelid_moleculardata_mapping').insert(dataObj);
        });
};