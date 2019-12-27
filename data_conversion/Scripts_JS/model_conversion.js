// This code will read through each of the files in ./Initial_csv_file/model_information folder
// and produce the required result in the corresponding
// file modelinfo_final in Final_csv_file folder.


// requiring various packages.
const fs = require('fs');
const csv = require('fast-csv');
const MultiStream = require('multistream');

// this will take the file_reader function from file_reader file used to loop through the files.
const file_reader = require('./file_reader');

// folder from where the files will be read.
const file_folder = '/Initial_csv_file/model_information/';
const file_final = (file_folder.split('/'))[2];

// this array is required to store the lines read from the input csv file.
const results = [];
const streams = [];
let id = 6367;

// creates a write stream with headers we require in final csv file and creating a writable stream with the final file.
const csvStream = csv.createWriteStream({ headers: ['model_id', 'model'] });
const writableStream = fs.createWriteStream('../Final_csv_file/models_final.csv');

// synch. way of reading through the files and push createReadStream for each file with it's path.
const files = fs.readdirSync(`..${file_folder}`);
const total_files = files.length;

// reads the input file and streams the data with particular format to the output file.
function outputData() {
    MultiStream(streams).pipe(csv())
        .on('data', (data) => {
            results.push(data);
        })
        .on('end', () => {
            csvStream.pipe(writableStream);
            const models = [];
            results.forEach((data) => {
                if (data[0] !== '' && data[0] !== 'model.id' && data[1] !== 'model.id') {
                    if (!(models.includes(data[1]))) {
                        models.push(data[1]);
                    }
                }
            });

            models.forEach((model) => {
                // model = model.split('\r')[0];
                csvStream.write({ model_id: id++, model });
            });
            console.log('Done with the conversion');
        });
}

// calling function to loop through all the files in folder and gives the output
file_reader(files, total_files, file_folder, outputData, streams);
