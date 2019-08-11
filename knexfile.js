// Update with your config settings.

// Update with your config settings.

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      user : 'root',
      password : 'beri@2493',
      database : 'XevaDB_Latest'
    },
    migrations: {
      directory: __dirname + '/db/migrations',
    },
    seeds: {
      directory: __dirname + '/db/seeds',
    },
  },
 };