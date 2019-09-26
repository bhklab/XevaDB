// Todo: We have to take care about the sequencing_uid which has for time being assumed to be the patient ids.
// This code will take sequencing_data folder as the input and convert it into desired final csv file.
const csv = require('fast-csv')
const fs = require('fs')
let MultiStream = require('multistream')

// this will take the file_reader function from file_reader file used to loop through the files.
const file_iterator = require('./file_iterator')
const file_reader = require('./file_reader')

//folder from where the files will be read.
const file_folder = "/Initial_Csv_File/mutation_data/"
//const file_final = (file_folder.split("/"))[2]
const file_final = "mutation"

//this array is required to store the lines read from the input csv file.
const results = [];
let streams = [];

// synch. way of reading through the files and push createReadStream for each file with it's path.
let files = fs.readdirSync(`..${file_folder}`);
let total_files = files.length;

// These variables are for file_iterator, the mapped variables.
const file_folder_map = "/Final_Csv_File/"
let files_map = ['genes_final.csv', 'sequencings_final.csv']
let streams_map = [];
let mapped_data = {};

// creates a write stream with headers we require in final csv file.
var csvStream = csv.createWriteStream({headers: ["id", "gene_id", "sequencing_uid", "value"]});
var writableStream = fs.createWriteStream(`../Final_Csv_File/${file_final}_final.csv`);


// reads the input file.
let id = 1;
function outputData() {
    MultiStream(streams).pipe(csv())
                        .on('data', function(data) {
                            results.push(data);
                        })
                        .on('end', () => {
                            csvStream.pipe(writableStream); 
                            results.forEach((data) => {
                                if(data[0].match(/X-[\d]/g) || data[1].match(/X-[\d]/g)) {
                                    patientId = [];
                                    patientId.push(data);
                                    patientId = patientId[0].toString().split(",");
                                    if (patientId[0] === "") {patientId.shift()}
                                }

                                var geneId = data[0];
                                var value = 0;
                                data.forEach((Mutation) => {
                                            if(geneId!=""){
                                                if(Mutation == geneId) {}
                                                else {
                                                    if(patientId[value]!= " ") {
                                                        csvStream.write({id: id++, gene_id: mapped_data[geneId], sequencing_uid: mapped_data[patientId[value]], value: Mutation});
                                                        value++;
                                                    } else {}
                                                }
                                            }  
                                    })
                            })
                            console.log("Done with the conversion");
                        })
}

// function to create a new promise and calling the file iterator function.
let callIterator = () => {
    return new Promise((resolve, reject) => {
      file_iterator(files_map, file_folder_map, streams_map, mapped_data, (response) => {
          if(Object.entries(response).length === 0 && response.constructor === Object) {
            reject('Error')
          } else {
            resolve(mapped_data)
          }
        }
      )
    })
  }
  
  // calling the file reader function when the file iterator has been resolved or rejected.
  callIterator().then(() => {
                        file_reader(files, total_files, file_folder, outputData, streams)
                      })
                .catch(error => {
                    console.log(error);
                })