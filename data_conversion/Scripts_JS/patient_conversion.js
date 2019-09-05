// This code will take response_evaluation folder as the input and convert it into desired final csv file.
const fs = require('fs')
const csv = require('fast-csv')
let MultiStream = require('multistream')

// this will take the file_reader function from file_reader file used to loop through the files.
const file_reader = require('./file_reader')

//folder from where the files will be read.
const file_folder = "/Initial_Csv_File/response_evaluation/"

//this array is required to store the lines read from the input csv file and other array would store the combined.
let results = [];
let streams = [];

// creates a write stream with headers we require in final csv file.
var csvStream = csv.createWriteStream({headers: ["patient_id", "patient"]});
var writableStream = fs.createWriteStream(`../Final_Csv_File/patients_final.csv`);

// synch. way of reading through the files and push createReadStream for each file with it's path.
let files = fs.readdirSync(`..${file_folder}`);
let total_files = files.length;
let id = 1;

// reads the input file.
function outputData() {
  MultiStream(streams).pipe(csv())
                      .on('data', function(data) {
                        if(data[0] === "" && (data[1].includes("X-"))) {
                          data.shift()
                          results.push(data)
                        } else if(data[0].includes("X-") && (data[1].includes("X-"))) {results.push(data)}
                        
                      })
                      .on('end', () => {
                        csvStream.pipe(writableStream);
                        results.map((data) => {
                          data.forEach(data => {
                            csvStream.write({patient_id: id++, patient: data});
                          })   
                        })
                        console.log("Done with the conversion");
                      });
}

//calling function to loop through all the files in folder and gives the output
file_reader(files, total_files, file_folder, outputData, streams)