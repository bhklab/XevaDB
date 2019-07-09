
exports.up = function(knex, Promise) {
    return knex.schema.createTable('model_information', (table) => {
        table.string('model_id').primary();
        table.string('tissue_id').notNullable();
        table.string('tissue').notNullable();
        table.string('patient_id')
             .notNullable()
             .references('patient_id')
             .inTable('patient_information')
             .index();
        table.string('drug').notNullable();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('model_information');
};
