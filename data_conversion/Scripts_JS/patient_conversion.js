// This code will take response_evaluation folder as the input
// and convert it into desired final csv file.
const fs = require('fs');
const csv = require('fast-csv');
const MultiStream = require('multistream');

// this will take the file_reader function from file_reader file used to loop through the files.
const file_reader = require('./file_reader');

// folder from where the files will be read.
const file_folder = '/Initial_Csv_File/model_information/';

// this array is required to store the lines read
// from the input csv file and other array would store the combined.
const results = [];
const streams = [];

// creates a write stream with headers we require in final csv file.
const csvStream = csv.createWriteStream({ headers: ['patient_id', 'patient'] });
const writableStream = fs.createWriteStream('../Final_Csv_File/patients_final.csv');

// synch. way of reading through the files and push createReadStream for each file with it's path.
const files = fs.readdirSync(`..${file_folder}`);
const total_files = files.length;
let id = 1;

// reads the input file.
function outputData() {
    MultiStream(streams).pipe(csv())
        .on('data', (data) => {
            results.push(data);
        })
        .on('end', () => {
            csvStream.pipe(writableStream);
            const patients = [];
            results.forEach((data) => {
                if (data[0] !== '' && data[0] !== 'model.id') {
                    if (!(patients.includes(data[3]))) {
                        patients.push(data[3]);
                    }
                }
            });

            patients.forEach((patient) => {
                csvStream.write({ patient_id: id++, patient });
            });
            console.log('Done with the conversion');
        });
}

// calling function to loop through all the files in folder and gives the output
file_reader(files, total_files, file_folder, outputData, streams);
