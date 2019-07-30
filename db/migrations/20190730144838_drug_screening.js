
exports.up = function(knex, Promise) {
    return knex.schema.createTable('drug_screening', (table) => {
        table.increments();
        table.string('model_id')
             .notNullable()
             .references('model_id')
             .inTable('model_information')
             .index();
        table.string('drug')
             .notNullable()
             .references('drug_id')
             .inTable('drug')
             .index();
        table.decimal('time').notNullable();
        table.decimal('volume').notNullable();
        table.decimal('volume_normal',64,16).notNullable();
        table.string('patient_id')
             .notNullable()
             .references('patient_id')
             .inTable('patient_information')
             .index();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('drug_screening');
};