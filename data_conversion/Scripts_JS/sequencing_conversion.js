/*This code takes the batch csv file as the input 
and produce a file growthcurve_data.csv as the output*/

const csv = require('fast-csv')
const fs = require('fs')
let MultiStream = require('multistream')

// this will take the file_reader function from file_reader file used to loop through the files.
const file_reader = require('./file_reader')

//folder from where the files will be read.
const file_folder = "/Initial_Csv_File/sequencing_data/"
const file_final = (file_folder.split("/"))[2]

//this array is required to store the lines read from the input csv file.
const results = [];
let streams = [];
let id = 1;

//creating a writable stream which writes to growthcurve_data csv file.
var csvStream = csv.createWriteStream({headers: ["sequencing_uid", "sequencing_id"]});
var writableStream = fs.createWriteStream(`../Final_Csv_File/sequencing_final.csv`);

// synch. way of reading through the files and push createReadStream for each file with it's path.
let files = fs.readdirSync(`..${file_folder}`);
let total_files = files.length;

//creating a read stream which is used to 
function outputData() {
  MultiStream(streams).pipe(csv())
                      .on('data', function(data) {
                          results.push(data);
                      })
                      .on('end', () => {
                        csvStream.pipe(writableStream); 
                        seq = []
                        results.forEach((data) => {
                            if(data[0].match(/X-[\d]/g) || data[1].match(/X-[\d]/g)) {
                                data.forEach((data) => {
                                    if(data !== ''){
                                        if(!(seq.includes(data))) {
                                            seq.push(data)
                                        }
                                    }
                                })
                            }
                        })

                        seq.forEach((seq) => {
                            csvStream.write({sequencing_uid: id++, sequencing_id: seq})
                        })
                        console.log("Done with the conversion");

                      }); 
}

//calling function to loop through all the files in folder and gives the output
file_reader(files, total_files, file_folder, outputData, streams)