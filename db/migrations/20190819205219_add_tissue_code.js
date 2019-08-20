
exports.up = function(knex, Promise) {
    return knex.schema.table('tissues', function(table) {
        table.string('tissue_code').notNullable()
    })
  }
  
  exports.down = function(knex, Promise) {
    return knex.schema.table('tissues', function(table) {
        table.dropColumn('tissue_code')
    })
  }