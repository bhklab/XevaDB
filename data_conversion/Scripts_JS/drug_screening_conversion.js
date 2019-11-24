/* This code takes the drug screening folder and parse through the csv files , acting as the input
and produce a file drug_screening_final.csv as the output */

// requiring the various packages.
const csv = require('fast-csv');
const fs = require('fs');
const MultiStream = require('multistream');

// this will take the file_reader function from file_reader file used to loop through the files.
const file_iterator = require('./file_iterator');
const file_reader = require('./file_reader');

// folder from where the files will be read.
const file_folder = '/Initial_Csv_File/drug_screening/';
const file_final = (file_folder.split('/'))[2];

// this array is required to store the lines read from the input csv file.
const results = [];
const streams = [];

// synch. way of reading through the files and push createReadStream for each file with it's path.
const files = fs.readdirSync(`..${file_folder}`);
const total_files = files.length;

// These variables are for file_iterator, the mapped variables.
const file_folder_map = '/Final_Csv_File/';
const files_map = ['models_final.csv', 'drugs_final.csv'];
const streams_map = [];
const mapped_data = {};


// creating a writable stream which writes to growthcurve_data csv file.
// let csvStream = csv.createWriteStream({headers: ["model_id", "drug", "time", "volume", "body_weight", "volume_normal", "tissue", "patient_id"]});
const csvStream = csv.createWriteStream({ headers: ['id', 'model_id', 'drug_id', 'time', 'volume', 'volume_normal'] });
const writableStream = fs.createWriteStream(`../Final_Csv_File/${file_final}_final.csv`);


// creating a read stream which is used to
let id = 1;
function outputData() {
    MultiStream(streams).pipe(csv())
        .on('data', (data) => {
            results.push(data);
        })
        .on('end', () => {
            csvStream.pipe(writableStream);
            results.forEach((data) => {
                if (data[0] === 'model.id' || data[0] === '') {} else {
                    // csvStream.write({model_id: data[0], drug: data[1], time: data[2], volume: data[3], body_weight: data[4], volume_normal: data[5], tissue: tissue_id, patient_id: patient_id});
                    csvStream.write({
                        id: id++, model_id: mapped_data[data[1]], drug_id: mapped_data[data[2]], time: data[3], volume: data[4], volume_normal: data[5],
                    });
                }
            });
            console.log('Done with the conversion');
        });
}

// function to create a new promise and calling the file iterator function.
const callIterator = () => new Promise((resolve, reject) => {
    file_iterator(files_map, file_folder_map, streams_map, mapped_data, (response) => {
        if (Object.entries(response).length === 0 && response.constructor === Object) {
            reject('Error');
        } else {
            resolve(mapped_data);
        }
    });
});

// calling the file reader function when the file iterator has been resolved or rejected.
callIterator().then(() => {
    file_reader(files, total_files, file_folder, outputData, streams);
})
    .catch((error) => {
        console.log(error);
    });
