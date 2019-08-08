// Update with your config settings.

// Update with your config settings.

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host : 'xevadb-database.mysql.database.azure.com',
      user : 'bhklab@xevadb-database',
      password : 'canada@24',
      database : 'Xevadb_dataset_table'
    },
    migrations: {
      directory: __dirname + '/db/migrations',
    },
    seeds: {
      directory: __dirname + '/db/seeds',
    },
  },
 };