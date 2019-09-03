// This function iterates through each of the csv files 


const fs = require('fs')
let MultiStream = require('multistream')
const csv = require('fast-csv')

// this will take the file_reader function from file_reader file used to loop through the files.
//const file_reader = require('./file_reader')

//const file_folder = "/Final_Csv_File/"
//let files = ['model_final.csv', 'tissues_final.csv', 'patient_final.csv', 'drug_final.csv', 'dataset_final.csv']
//let files = ['dataset_final.csv', 'drug_final.csv']

//let streams = [];
//let results = [];



let file_iterator = function (files, file_folder, streams, mapped_data, response) {
    let total_files = files.length
    let results = []
    files.forEach(file => {
        let dirname = __dirname.split('/')
                      dirname.pop();
                      dirname = dirname.join("/")

        if(total_files === 1) {
            streams.push(fs.createReadStream(dirname + file_folder + file));
            MultiStream(streams).pipe(csv())
                        .on('data', function(data) {
                            results.push(data)
                        })
                        .on('end', () => {
                            results.forEach((data) => {
                                if(data[0].match(/\d+/g)) {
                                    mapped_data[data[1]] = data[0]
                                }
                            })
                            response(mapped_data)
                        });   
        } else {
            streams.push(fs.createReadStream(dirname + file_folder + file));
            total_files--;
        }
      });
}
  
//file_iterator(files, file_folder, streams)


module.exports = file_iterator;