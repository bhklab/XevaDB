/* eslint-disable no-console */
const csv = require('csvtojson');
const path = require('path');
const fs = require('fs');
const dataPath = require('../path');

const csvFilePath = path.join(dataPath, 'copy_number_variation.csv');
const parserParams = {
    delimiter: ',', // optional
    quote: '"', // optional
    ignoreEmpty: true,
};

exports.seed = async (knex) => {
    let seedingData = []; // variable to store the streaming data.
    const chunkSize = 100000;
    const readStream = fs.createReadStream(csvFilePath); // read stream.

    // truncating the copy number variation data.
    await knex('copy_number_variation').truncate()
        .on('query', () => {
            console.log(`${'='.repeat(20).trimEnd()}truncating copy_number_variation table!${'='.repeat(20).trimEnd()}`);
        })
        .on('query-response', (response) => {
            console.log('trancating copy_number_variation table has been completed!', response);
        })
        .on('query-error', (error) => {
            console.log(error, 'an error occured while creating copy_number_variation table!');
        });

    // function to insert data into the copy number variation table.
    const insertData = async (i) => {
        await knex('copy_number_variation').insert(seedingData)
            .then(() => {
                if (i) {
                    console.log(`Inserting next 100k rows, currently at index ${i}`);
                } else {
                    console.log('Inserting last set of rows!!');
                }
            })
            .catch((error) => {
                console.log('Error occured while inserting the data', error);
            });

        // re-initialize the seeding data array.
        seedingData = [];
    };

    // this will streamline the data and seeds the table on every 100k rows
    // and remaining rows will be seeded on the end of the stream line process.
    await csv(parserParams)
        .fromStream(readStream)
        .subscribe(async (data, i) => {
            // updating the seeding data array.
            seedingData.push(data);
            // insert data for every 100k rows from the input.
            if (i % chunkSize === 0 && i > 0) {
                await insertData(i);
            }
        })
        .then(async () => { // this will insert the remaining data into the table.
            await knex('copy_number_variation').insert(seedingData)
                .on('query', () => {
                    console.log('Inserting data into the copy_number_variation table!!');
                })
                .on('query-response', (response) => {
                    console.log(`${'='.repeat(20).trimEnd()}Inserted ${response} rows into the copy_number_variation table!!${'='.repeat(20).trimEnd()}`);
                })
                .on('query-error', (error) => {
                    console.log(error, 'an error occured while creating copy_number_variation table!');
                });
        });
};
