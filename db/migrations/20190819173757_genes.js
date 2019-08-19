
exports.up = function(knex, Promise) {
    return knex.schema.createTable('genes', (table) => {
        table.increments('gene_id')
             .primary();
        table.string('gene_name')
             .notNullable();
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('genes');
};
