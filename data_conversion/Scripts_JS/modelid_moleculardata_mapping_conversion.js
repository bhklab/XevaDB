// This code will change the pdxe_mutation.csv into desired csv file.
const csv = require('fast-csv')
const fs = require('fs')
let MultiStream = require('multistream')

// this will take the file_reader function from file_reader file used to loop through the files.
const file_iterator = require('./file_iterator')
const file_reader = require('./file_reader')

//folder from where the files will be read.
const file_folder = "/Initial_Csv_File/modelid_moleculardata_mapping/"
const file_final = (file_folder.split("/"))[2]

//this array is required to store the lines read from the input csv file.
const results = [];
let streams = [];

// synch. way of reading through the files and push createReadStream for each file with it's path.
let files = fs.readdirSync(`..${file_folder}`);
let total_files = files.length;

// These variables are for file_iterator, the mapped variables.
const file_folder_map = "/Final_Csv_File/"
let files_map = ['models_final.csv', 'sequencings_final.csv']
let streams_map = [];
let mapped_data = {};

// creates a write stream with headers we require in final csv file.
var csvStream = csv.createWriteStream({headers: ["id", "model_id", "sequencing_uid", "mDataType"]});
var writableStream = fs.createWriteStream(`../Final_Csv_File/${file_final}_final.csv`);



// reads the input file.
let id = 1
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
                                  csvStream.write({id: id++, model_id: mapped_data[data[1]], sequencing_uid: mapped_data[data[2]], mDataType: data[3]});
                              }
                          })
                          
                          console.log("Done with the conversion");
    });
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