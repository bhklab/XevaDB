// This code will read through each of the files in ./Initial_Csv_File/model_information folder 
// and produce the required result in the corresponding file modelinfo_final in Final_Csv_File folder.


// requiring various packages.
const fs = require('fs')
const csv = require('fast-csv')
let MultiStream = require('multistream')

// this will take the file_reader function from file_reader file used to loop through the files.
// file iterator.
const file_iterator = require('./file_iterator')
const file_reader = require('./file_reader')

//folder from where the files will be read.
const file_folder = "/Initial_Csv_File/model_information/"
const file_final = (file_folder.split("/"))[2]

//this array is required to store the lines read from the input csv file.
const results = [];
let streams = [];

// synch. way of reading through the files and push createReadStream for each file with it's path.
let files = fs.readdirSync(`..${file_folder}`);
let total_files = files.length;


// These variables are for file_iterator, the mapped variables.
const file_folder_map = "/Final_Csv_File/"
let files_map = ['models_final.csv', 'tissues_final.csv', 'patients_final.csv', 'drugs_final.csv', 'datasets_final.csv']
//let files_map = ['dataset_final.csv', 'drug_final.csv']
let streams_map = [];
let mapped_data = {};



// creates a write stream with headers we require in final csv file and creating a writable stream with the final file.
let csvStream = csv.createWriteStream({headers: ["id", "model_id", "tissue_id", "patient_id", "drug_id", "tested", "dataset_id"]});
let writableStream = fs.createWriteStream(`../Final_Csv_File/${file_final}_final.csv`);



// reads the input file and streams the data with particular format to the output file.
let id = 1;
function outputData() {
  MultiStream(streams).pipe(csv())
                      .on('data', function(data) {
                          results.push(data);
                      })
                      .on('end', () => {
                        csvStream.pipe(writableStream);
                        results.map((data) => {
                            if((data[0] ===  "") || (data[0] === "model.id")) {} 
                            else {
                                let dataset = 0;
                                if(data[3].match(/Breast/g) || data[2].match(/BRCA/g)) {
                                  dataset = 1;
                                } else if (data[3].match(/Colorectal/g) || data[2].match(/CRC/g)) {
                                  dataset = 2;
                                }  else if (data[3].match(/Cutaneous/g) || data[2].match(/CM/g)) {
                                  dataset = 3;
                                }  else if (data[3].match(/Gastric/g) || data[2].match(/GC/g)) {
                                  dataset = 4;
                                }  else if (data[3].match(/Lung/g) || data[2].match(/NSCLC/g)) {
                                  dataset = 5;
                                }  else if (data[3].match(/Pancreatic/g) || data[2].match(/PDAC/g)) {
                                  dataset = 6;
                                } 
                                csvStream.write({id: id++, model_id: mapped_data[data[1]], tissue_id: mapped_data[data[2]], patient_id: mapped_data[data[4]], drug_id: mapped_data[data[5]], tested: data[6], dataset_id: dataset});
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