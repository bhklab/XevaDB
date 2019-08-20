// This code will change the pdxe_mutation.csv into desired csv file.
const csv = require('fast-csv')
const fs = require('fs')
let MultiStream = require('multistream')

// this will take the file_reader function from file_reader file used to loop through the files.
const file_reader = require('./file_reader')

//folder from where the files will be read.
const file_folder = "/Initial_Csv_File/modelid_moleculardata_mapping/"
const file_final = (file_folder.split("/"))[2]

//this array is required to store the lines read from the input csv file.
const results = [];
let streams = [];

// creates a write stream with headers we require in final csv file.
var csvStream = csv.createWriteStream({headers: ["model_id", "patient_id", "mDataType"]});
var writableStream = fs.createWriteStream(`./Final_Csv_File/${file_final}_final.csv`);

// synch. way of reading through the files and push createReadStream for each file with it's path.
let files = fs.readdirSync(`.${file_folder}`);
let total_files = files.length;

// reads the input file.
function outputData() {
    MultiStream(streams).pipe(csv())
                        .on('data', function(data) {
                            results.push(data);
                        })
                        .on('end', () => {
                          csvStream.pipe(writableStream);
                          results.map((data) => {
                              if(data[0] == "model.id" || data[0] == "") {}
                              else {
                                  csvStream.write({model_id: data[1], patient_id: data[2], mDataType: data[3]});
                              }
                          })
                          
                          console.log("Done with the conversion");
    });
}

//calling function to loop through all the files in folder and gives the output
file_reader(files, total_files, file_folder, outputData, streams)