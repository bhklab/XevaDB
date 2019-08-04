
exports.up = function(knex, Promise) {
    return knex.schema.createTable('modelid_moleculardata_mapping', (table) => {
        table.increments();
        table.string('model_id')
             .notNullable()
             .references('model_id')
             .inTable('model_information')
             .index();
        table.string('patient_id')
             .notNullable()
             .references('patient_id')
             .inTable('patient_information')
             .index();
        table.string('mDataType').notNullable();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('modelid_moleculardata_mapping');
};