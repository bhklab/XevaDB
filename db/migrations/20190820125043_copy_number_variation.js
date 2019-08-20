
exports.up = function(knex, Promise) {
    return knex.schema.createTable('copy_number_variation', (table) => {
        table.increments();
        table.integer('gene_id')
             .notNullable()
             .unsigned()
             .references('gene_id')
             .inTable('genes')
             .index();
        table.string('sequencing_id')
             .notNullable();
        table.string('value').notNullable();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('copy_number_variation');
};