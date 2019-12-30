// Todo: Patient_id has been placed here for model_id. Change the data.
// This code will take response_evaluation folder as the input
// and convert it into desired final csv file.
const csv = require('fast-csv');
const fs = require('fs');
const MultiStream = require('multistream');

// this will take the file_reader function from file_reader file used to loop through the files.
const file_iterator = require('./file_iterator');
const file_reader = require('./file_reader');

// folder from where the files will be read.
const file_folder = '/Initial_csv_file/model_response/';
const file_final = (file_folder.split('/'))[2];

// this array is required to store the lines read from the input csv file.
const results = [];
const streams = [];

// synch. way of reading through the files and push createReadStream for each file with it's path.
const files = fs.readdirSync(`..${file_folder}`);
const total_files = files.length;

// These variables are for file_iterator, the mapped variables.
const file_folder_map = '/Final_csv_file/';
const files_map = ['models_final.csv', 'drugs_final.csv'];
const streams_map = [];
const mapped_data = {};

// creates a write stream with headers we require in final csv file.
const csvStream = csv.createWriteStream({ headers: ['id', 'drug_id', 'model_id', 'response_type', 'value'] });
const writableStream = fs.createWriteStream(`../Final_csv_file/model_${file_final}_final.csv`);


// reads the input file.
let id = 18825;
function outputData() {
    MultiStream(streams).pipe(csv())
        .on('data', (data) => {
            results.push(data);
        })
        .on('end', () => {
            csvStream.pipe(writableStream);
            results.forEach((data) => {
                if ((data[0] === '') || (data[0] === 'drug') || (data[1] === 'drug')) {} else {
                    const drug = mapped_data[data[1]] || mapped_data[data[1].toLowerCase()];
                    csvStream.write({
                        id: id++, drug_id: drug, model_id: mapped_data[data[2]], response_type: data[3], value: data[4],
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
