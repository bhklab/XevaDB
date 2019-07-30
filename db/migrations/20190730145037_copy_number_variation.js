
exports.up = function(knex, Promise) {
    return knex.schema.createTable('copy_number_variation', (table) => {
        table.increments();
        table.string('patient_id')
             .notNullable()
             .references('patient_id')
             .inTable('patient_information')
             .index();
        table.string('gene_id').notNullable();
        table.decimal('copy_number').notNullable();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('copy_number_variation');
};
