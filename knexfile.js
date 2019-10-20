// Update with your config settings.
module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host : 'xevadb-database.mysql.database.azure.com',
      user : 'bhklab@xevadb-database',
      password : 'canada@24',
      database : 'xevadb_latest'
      // host: 'localhost',
      // user: 'root',
      // password: '-----',
      // database: 'xevadb_latest1'
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
      host : 'xevadb-database.mysql.database.azure.com',
      user : 'bhklab@xevadb-database',
      password : 'canada@24',
      database : 'xevadb_latest'
    },
    migrations: {
      directory: __dirname + '/db/migrations',
    },
    seeds: {
      directory: __dirname + '/db/seeds',
    },
  }
 };