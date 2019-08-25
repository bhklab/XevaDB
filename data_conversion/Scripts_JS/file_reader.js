// This function is used by each of the CSV files and will replace any tabs with commas and will produce streams of different CSV files.

const csv = require('fast-csv')
const fs = require('fs')
const path = require('path')
let MultiStream = require('multistream')

let file_reader = function(files, total_files, file_folder, outputData, streams) {
    files.forEach(file => {
        // variable to store the data read from the file.
        let file_data = '';
        let toggle = false;
        let dirname = __dirname.split('/')
                      dirname.pop();
                      dirname = dirname.join("/")
          fs.createReadStream(dirname + file_folder + file).setEncoding('utf8')
            .on("data", (data) => {
              if(data.match(/\t/g)) {
                data = data.replace(/\t/g,",")
                file_data += data;
                toggle = true;
              }
            })  
            .on("end", () => {
              //this will check for the toggle if true will re-write to the same file else it will push it to the stream.
              if(toggle) {
                fs.createWriteStream(dirname + file_folder + file).write(file_data);
                streams.push(fs.createReadStream(dirname + file_folder + file));
              } else {
                streams.push(fs.createReadStream(dirname + file_folder + file));
              }  
              // this is a checkpoint, if the number of files to be processed is equal to 1 then it will run the output data function else will reduce.
              if(total_files == 1) {
                outputData();
              } else {
                total_files = total_files - 1 ;
              }
            })  
      });
}

module.exports = file_reader;