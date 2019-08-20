/// This code will take copy_number_variation folder as the input and convert it into desired final csv file.
const csv = require('fast-csv')
const fs = require('fs')
let MultiStream = require('multistream')

// this will take the file_reader function from file_reader file used to loop through the files.
const file_reader = require('./file_reader')

//folder from where the files will be read.
const file_folder = "/Initial_Csv_File/copy_number_variation/"
const file_final = (file_folder.split("/"))[2]

//this array is required to store the lines read from the input csv file.
const results = [];
let streams = [];

// creates a write stream with headers we require in final csv file.
var csvStream = csv.createWriteStream({headers: ["gene_id", "patient_id", "copy_number"]});
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
                            results.forEach((data) => {
                                if(data[0].includes("X-") || data[1].includes("X-")) {
                                patientId = [];
                                patientId.push(results[0]);
                                patientId = patientId[0].toString().split(",");
                                if (patientId[0] === "") {patientId.shift()}
                                }

                            if(data[0] == "" || data[0].includes("X--"))  { var geneId = "False" }
                            else { var geneId = data[0] };
                            var value = 0;

                            data.forEach((CopyNumber) => {
                                    if(geneId!="False"){
                                        if(CopyNumber==geneId) {}
                                        else {
                                            if(patientId[value]!= " ") {
                                                csvStream.write({gene_id: geneId,patient_id: patientId[value], copy_number: CopyNumber});
                                                value++;
                                            } else {}
                                        }
                                    }  
                            })
                            
                            })
                            console.log("Done with the conversion");
                        });

}

//calling function to loop through all the files in folder and gives the output
file_reader(files, total_files, file_folder, outputData, streams)