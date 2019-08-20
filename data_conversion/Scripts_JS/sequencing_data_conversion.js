/// This code will take sequencing_data folder as the input and convert it into desired final csv file.
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

// creates a write stream with headers we require in final csv file.
var csvStream = csv.createWriteStream({headers: ["id","gene_id", "patient_id", "mutation"]});
var writableStream = fs.createWriteStream(`./Final_Csv_File/${file_final}_final.csv`);

// synch. way of reading through the files and push createReadStream for each file with it's path.
let files = fs.readdirSync(`.${file_folder}`);
let total_files = files.length;
let id = 1;


// reads the input file.
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
                                                        csvStream.write({id: id++, gene_id: geneId,patient_id: patientId[value], mutation: Mutation});
                                                        value++;
                                                    } else {}
                                                }
                                            }  
                                    })
                            })
                            console.log("Done with the conversion");
                        })
}

//calling function to loop through all the files in folder and gives the output
file_reader(files, total_files, file_folder, outputData, streams)