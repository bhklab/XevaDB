// / This code will take sequencing_data folder as the input and convert it into desired final csv file.
const csv = require('fast-csv');
const fs = require('fs');
const MultiStream = require('multistream');

// this will take the file_reader function from file_reader file used to loop through the files.
const file_reader = require('./file_reader');

// folder from where the files will be read.
const file_folder = '/Initial_csv_file/model_information/';
const file_final = (file_folder.split('/'))[2];

// this array is required to store the lines read from the input csv file.
const results = [];
const streams = [];

// creates a write stream with headers we require in final csv file.
const csvStream = csv.createWriteStream({ headers: ['tissue_id', 'tissue_name'] });
const writableStream = fs.createWriteStream('../Final_csv_file/tissues_final.csv');

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
            const tissues = [];
            results.forEach((data) => {
                if (!((data[0] === '') || (data[0] === 'model.id') || (data[1] === 'model.id'))) {
                    // tissues should be in data array at index 2 (place 3).
                    if (!(tissues.includes(`${data[2]}`))) {
                        tissues.push(`${data[2]}`);
                    }
                }
            });

            tissues.forEach((tissue) => {
                csvStream.write({ tissue_id: id++, tissue_name: tissue.split('/')[0] });
            });
            console.log('Done with the conversion');
        });
}

// calling function to loop through all the files in folder and gives the output
file_reader(files, total_files, file_folder, outputData, streams);
