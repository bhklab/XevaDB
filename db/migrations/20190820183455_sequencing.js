
exports.up = function(knex, Promise) {
    return knex.schema.createTable('sequencing', (table) => {
        table.increments('sequencing_uid')
             .primary();
        table.string('sequencing_id')
             .notNullable();
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('sequencing');
};
