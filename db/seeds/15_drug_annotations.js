const csv = require('csvjson')
const fs = require('fs')
const data_path = require('../path')

const file_location = `${data_path}/drug_annotations.csv`

const file = fs.readFileSync(file_location, 'utf8')
const dataObj = csv.toObject(file)


exports.seed = function (knex, Promise) {
    return knex('drug_annotations').del()
        .then(function () {
            return knex('drug_annotations').insert(dataObj);
        });
};