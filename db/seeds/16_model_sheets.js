const csv = require('csvjson')
const fs = require('fs')
const data_path = require('../path')

const options = {
    delimiter: ',', // optional
    quote: '"', // optional
};

const file_location = `${data_path}/model_sheets.csv`

const file = fs.readFileSync(file_location, 'utf8')
const dataObj = csv.toObject(file, options)


exports.seed = function (knex, Promise) {
    return knex('model_sheets').del()
        .then(function () {
            return knex('model_sheets').insert(dataObj);
        });
};