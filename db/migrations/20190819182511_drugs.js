
exports.up = function(knex, Promise) {
    return knex.schema.createTable('drugs', (table) => {
        table.increments('drug_id')
             .primary();
        table.string('drug_name').notNullable();
        table.string('standard_name');
        table.string('targets');
        table.string('treatment_type');
        table.string('pubchemId');
        table.string('class');
        table.string('class_name');
        table.string('source');
    })
  };
  
  exports.down = function(knex, Promise) {
      return knex.schema.dropTable('drugs');
  };
