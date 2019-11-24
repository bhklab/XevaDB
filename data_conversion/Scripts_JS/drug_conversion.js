/* This code takes the drug screening folder and parse through the csv files , acting as the input
and produce a file drug_screening_final.csv as the output */

// requiring the various packages.
const csv = require('fast-csv');
const fs = require('fs');
const MultiStream = require('multistream');

// this will take the file_reader function from file_reader file used to loop through the files.
const file_reader = require('./file_reader');

// folder from where the files will be read.
const file_folder = '/Initial_Csv_File/drug_screening/';
const file_final = (file_folder.split('/'))[2];

// this array is required to store the lines read from the input csv file.
const results = [];
const streams = [];
let id = 1;

// creating a writable stream which writes to growthcurve_data csv file.
const csvStream = csv.createWriteStream({ headers: ['drug_id', 'drug_name', 'standard_name', 'targets', 'treatment_type', 'pubchemId', 'class', 'class_name', 'source'] });
const writableStream = fs.createWriteStream('../Final_Csv_File/drugs_final.csv');


// synch. way of reading through the files and push createReadStream for each file with it's path.
const files = fs.readdirSync(`..${file_folder}`);
const total_files = files.length;

// creating a read stream which is used to
function outputData() {
    MultiStream(streams).pipe(csv())
        .on('data', (data) => {
            results.push(data);
        })
        .on('end', () => {
            csvStream.pipe(writableStream);
            drugs = [];
            results.forEach((data) => {
                if (!(data[0] === '') || (data[0] === 'model.id')) {
                    if (!(drugs.includes(data[2]))) {
                        drugs.push(data[2]);
                    }
                }
            });

            drugs.forEach((drug) => {
                csvStream.write({
                    drug_id: id++, drug_name: drug, standard_name: '', targets: '', treatment_type: '', pubchemId: '', class: '', class_name: '', source: '',
                });
            });
            console.log('Done with the conversion');
        });
}

// calling function to loop through all the files in folder and gives the output
file_reader(files, total_files, file_folder, outputData, streams);
