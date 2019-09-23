
exports.up = function(knex, Promise) {
    return knex.schema.createTable('batches', (table) => {
        table.increments('batch_id')
             .primary();
        table.string('batch')
             .notNullable();
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('batches');
};
