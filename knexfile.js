/* 
	NODE_ENV=development npx knex migrate:latest
	NODE_ENV=development npx knex seed:run
*/
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

// Update with your config settings.
module.exports = {
    development: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
			infileStreamFactory: (filePath) => fs.createReadStream(filePath),
			flags: ['+LOCAL_FILES'], //Allows the sending of csvs to Sql server to parse (substantially faster than inserting row by row)
  			multipleStatements: true 
        },
        migrations: {
            directory: `${__dirname}/db/migrations`,
        },
        seeds: {
            directory: `${__dirname}/db/seeds`,
        },
    },
    production: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
			infileStreamFactory: (filePath) => fs.createReadStream(filePath),
			flags: ['+LOCAL_FILES'], //Allows the sending of csvs to Sql server to parse (substantially faster than inserting row by row)
  			multipleStatements: true 
        },
        migrations: {
            directory: `${__dirname}/db/migrations`,
        },
        seeds: {
            directory: `${__dirname}/db/seeds`,
        },
    },
};
