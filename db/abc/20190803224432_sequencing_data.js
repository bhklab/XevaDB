// This has been changed to mutation. Will delete this migration later.
exports.up = function(knex, Promise) {
    return knex.schema.createTable('sequencing_data', (table) => {
        table.increments();
        table.string('gene_id').notNullable();
        table.string('patient_id')
             .notNullable()
             .references('patient_id')
             .inTable('patient_information')
             .index();
        table.string('mutation').notNullable();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('sequencing_data');
};