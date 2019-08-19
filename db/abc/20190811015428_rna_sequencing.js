
exports.up = function(knex, Promise) {
    return knex.schema.createTable('rna_sequencing', (table) => {
        table.increments();
        table.string('gene_id').notNullable();
        table.string('patient_id')
             .notNullable()
             .references('patient_id')
             .inTable('patient_information')
             .index();
        table.string('expression').notNullable();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('rna_sequencing');
};
