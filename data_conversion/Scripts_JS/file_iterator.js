// This function iterates through each of the final csv files to
// produce an object to be used by different scripts.


const fs = require('fs');
const MultiStream = require('multistream');
const csv = require('fast-csv');


const file_iterator = (files, file_folder, streams, mapped_data, response) => {
    let total_files = files.length;
    const results = [];
    files.forEach((file) => {
        let dirname = __dirname.split('/');
        dirname.pop();
        dirname = dirname.join('/');

        if (total_files === 1) {
            streams.push(fs.createReadStream(dirname + file_folder + file));
            MultiStream(streams).pipe(csv())
                .on('data', (data) => {
                    results.push(data);
                })
                .on('end', () => {
                    results.forEach((data) => {
                        if (data[0].match(/\d+/g)) {
                            mapped_data[data[1]] = data[0];
                        }
                    });
                    response(mapped_data);
                });
        } else {
            streams.push(fs.createReadStream(dirname + file_folder + file));
            total_files--;
        }
    });
};


module.exports = file_iterator;
