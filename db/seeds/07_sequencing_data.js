let csv = require('csv-parser')
let Transform = require('stream').Transform;
let fs = require('fs');
const path = require('path')

const file_location = path.join(__dirname, '../../data_conversion/Final_Csv_File/sequencing_data_final.csv')

exports.seed = function(knex, Promise) {
      return new Promise(function (resolve, reject){
        fs.createReadStream(file_location)
          .on('error', reject)
          .pipe(csv())
          .on('error', reject)
          .pipe(new Transform({
            objectMode: true,
            transform: function (chunk, _, next) {
                knex('sequencing_data').insert(chunk).then(function () {
                    next();
                }, next);
            } })).on('error', reject)
            .on('finish', function() {
              console.log("Done");
            });
      });
};
