// This code will read through each of the files in ./Initial_Csv_File/model_information folder and produce the required result in the corresponding
// file modelinfo_final in Final_Csv_File folder.


// requiring various packages.
const fs = require('fs')
const csv = require('fast-csv')
let MultiStream = require('multistream')

// this will take the file_reader function from file_reader file used to loop through the files.
const file_reader = require('./file_reader')

//folder from where the files will be read.
const file_folder = "/Initial_Csv_File/model_information/"
const file_final = (file_folder.split("/"))[2]

//this array is required to store the lines read from the input csv file.
const results = [];
let streams = [];
let id = 1;

// creates a write stream with headers we require in final csv file and creating a writable stream with the final file.
let csvStream = csv.createWriteStream({headers: ["model_id", "model"]});
let writableStream = fs.createWriteStream(`../Final_Csv_File/models_final.csv`);

// synch. way of reading through the files and push createReadStream for each file with it's path.
let files = fs.readdirSync(`..${file_folder}`);
let total_files = files.length;

// reads the input file and streams the data with particular format to the output file.
function outputData() {
  MultiStream(streams).pipe(csv())
                      .on('data', function(data) {
                          results.push(data);
                      })
                      .on('end', () => {
                          csvStream.pipe(writableStream); 
                          models = []
                          results.forEach((data) => {
                              if(data[0] !== "model.id"){
                                  if(!(models.includes(data[0]))) {
                                      models.push(data[0])
                                  }
                              }
                          })

                          models.forEach((model) => {
                              csvStream.write({model_id: id++, model: model})
                          })
                          console.log("Done with the conversion");
                    }); 
}

//calling function to loop through all the files in folder and gives the output
file_reader(files, total_files, file_folder, outputData, streams)