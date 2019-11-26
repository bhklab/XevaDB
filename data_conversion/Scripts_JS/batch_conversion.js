/* This code takes the batch csv file as the input
and produce a file growthcurve_data.csv as the output */

const csv = require('fast-csv');
const fs = require('fs');
const MultiStream = require('multistream');

// this will take the file_reader function from file_reader file used to loop through the files.
const file_reader = require('./file_reader');

// folder from where the files will be read.
const file_folder = '/Initial_Csv_File/batch_information/';
const file_final = (file_folder.split('/'))[2];

// this array is required to store the lines read from the input csv file.
const results = [];
const streams = [];
let id = 4484;

// creating a writable stream which writes to growthcurve_data csv file.
const csvStream = csv.createWriteStream({ headers: ['batch_id', 'batch'] });
const writableStream = fs.createWriteStream('../Final_Csv_File/batches_final.csv');

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
            batches = [];
            results.forEach((data) => {
                if (data[0] !== '' && data[1] !== 'batch.id') {
                    if (!(batches.includes(data[1]))) {
                        batches.push(data[1]);
                    }
                }
            });

            batches.forEach((batch) => {
                csvStream.write({ batch_id: id++, batch });
            });
            console.log('Done with the conversion');
        });
}

// calling function to loop through all the files in folder and gives the output
file_reader(files, total_files, file_folder, outputData, streams);
