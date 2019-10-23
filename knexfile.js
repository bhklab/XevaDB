const dotenv = require('dotenv')
dotenv.config()

// Update with your config settings.
module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host : process.env.DB_HOST,
      user : process.env.DB_USER,
      password : process.env.DB_PWD,
      database : process.env.DB_NAME
    },
    migrations: {
      directory: __dirname + '/db/migrations',
    },
    seeds: {
      directory: __dirname + '/db/seeds',
    },
  },
  production: {
    client: 'mysql',
    connection: {
      host : process.env.DB_HOST,
      user : process.env.DB_USER,
      password : process.env.DB_PWD,
      database : process.env.DB_NAME
    },
    migrations: {
      directory: __dirname + '/db/migrations',
    },
    seeds: {
      directory: __dirname + '/db/seeds',
    },
  }
 };