/*This code takes the drug screening folder and parse through the csv files , acting as the input 
and produce a file drug_screening_final.csv as the output*/

//requiring the various packages.
const csv = require('fast-csv')
const fs = require('fs')
let MultiStream = require('multistream')

// this will take the file_reader function from file_reader file used to loop through the files.
const file_reader = require('./file_reader')

//folder from where the files will be read.
const file_folder = "/Initial_Csv_File/drug_screening/"
const file_final = (file_folder.split("/"))[2]

//this array is required to store the lines read from the input csv file.
const results = [];
let streams = [];

//creating a writable stream which writes to growthcurve_data csv file.
//let csvStream = csv.createWriteStream({headers: ["model_id", "drug", "time", "volume", "body_weight", "volume_normal", "tissue", "patient_id"]});
let csvStream = csv.createWriteStream({headers: ["model_id", "drug", "time", "volume", "volume_normal", "patient_id"]});
let writableStream = fs.createWriteStream(`../Final_Csv_File/${file_final}_final.csv`);


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
                        results.forEach((data) => {
                            if(data[0] === "model.id" || data[0] === "") {console.log(data)}
                            else {
                                id = data[1].split(".");
                                patient_id = id[0] + "-" + id[1];
                                //tissue_id = "Breast Cancer"
                                //remove first element from the array and write it to a new file.
                                data.shift();
                                //csvStream.write({model_id: data[0], drug: data[1], time: data[2], volume: data[3], body_weight: data[4], volume_normal: data[5], tissue: tissue_id, patient_id: patient_id});
                                csvStream.write({model_id: data[0], drug: data[1], time: data[2], volume: data[3], volume_normal: data[4], patient_id: patient_id});
                            }
                        })
                        console.log("Done with the conversion");
                      })
}

//calling function to loop through all the files in folder and gives the output
file_reader(files, total_files, file_folder, outputData, streams)