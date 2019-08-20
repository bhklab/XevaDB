
exports.up = function(knex, Promise) {
    return knex.schema.createTable('modelid_moleculardata_mapping', (table) => {
        table.increments();
        table.integer('model_id')
             .notNullable()
             .unsigned()
             .references('model_id')
             .inTable('model_information')
             .index();
        table.string('sequencing_id').notNullable();
        table.string('mDataType').notNullable();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('modelid_moleculardata_mapping');
};