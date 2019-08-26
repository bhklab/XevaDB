
exports.up = function(knex, Promise) {
    return knex.schema.createTable('rna_sequencing', (table) => {
        table.increments();
        table.integer('gene_id')
             .notNullable()
             .unsigned()
             .references('gene_id')
             .inTable('genes')
             .index();
        table.integer('sequencing_uid')
             .notNullable()
             .unsigned()
             .references('sequencing_uid')
             .inTable('sequencing')
             .index();
        table.string('value').notNullable();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('rna_sequencing');
};