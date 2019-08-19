
exports.up = function(knex, Promise) {
    return knex.schema.createTable('response_evaluation', (table) => {
        table.increments();
        table.string('patient_id')
             .notNullable()
             .references('patient_id')
             .inTable('patient_information')
             .index();
        table.string('drug')
             .notNullable()
             .references('drug_id')
             .inTable('drug')
             .index();
        table.string('response').notNullable();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('response_evaluation');
};