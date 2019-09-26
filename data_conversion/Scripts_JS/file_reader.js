// This function is used by each of the CSV files and will replace any tabs with commas and will produce streams of different CSV files.

const fs = require('fs')

let file_reader = function(files, total_files, file_folder, outputData, streams) {
    files.forEach(file => {
        // variable to store the data read from the file.
        let file_data = '';
        let toggle = false;
        let dirname = __dirname.split('/')
                      dirname.pop();
                      dirname = dirname.join("/")
        let path = ''
        
          if(typeof(file_folder) === 'string') {
            path = dirname + file_folder + file
          } else if (typeof(file_folder) === 'object' && file_folder.length >= 1) {
            file_folder.forEach(folder => {
              if(folder.includes(file.split('_')[0])) {
                path = dirname + folder + file
              }
            })
          }

          // changes the tap separated to comma separated lines.
          fs.createReadStream(path).setEncoding('utf8')
            .on("data", (data) => {
              if(data.match(/\t/g)) {
                data = data.replace(/\t/g,",")
                file_data += data;
                toggle = true;
              }
            })  
            .on("end", () => {
              // this will check for the toggle if true will re-write to the same file else it will push it to the stream.
              if(toggle) {
                fs.createWriteStream(path).write(file_data);
                streams.push(fs.createReadStream(path));
              } else {
                streams.push(fs.createReadStream(path));
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