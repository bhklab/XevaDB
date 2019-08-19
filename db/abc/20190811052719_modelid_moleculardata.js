
exports.up = function(knex, Promise) {
    return knex.schema.createTable('modelid_moleculardata', (table) => {
        table.increments();
        table.string('model_id')
             .notNullable()
             .references('model_id')
             .inTable('model_information')
             .index();
        table.string('biobase_id').notNullable();
        table.string('mDataType').notNullable();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('modelid_moleculardata');
};