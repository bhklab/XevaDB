
exports.up = function(knex, Promise) {
    return knex.schema.createTable('datasets', (table) => {
        table.integer('dataset_id').primary();
        table.string('dataset_name').notNullable();
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('datasets');
};
