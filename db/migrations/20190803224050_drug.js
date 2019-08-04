
exports.up = function(knex, Promise) {
    return knex.schema.createTable('drug', (table) => {
        table.string('drug_id').primary();
        table.string('standard_name').notNullable();
        table.string('targets').notNullable();
        table.string('treatment_type').notNullable();
        table.string('pubchemId');
        table.string('class').notNullable();
        table.string('class_name').notNullable();
        table.string('source').notNullable();
    })
  };
  
  exports.down = function(knex, Promise) {
      return knex.schema.dropTable('drug');
  };
  