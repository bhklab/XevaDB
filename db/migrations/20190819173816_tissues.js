
exports.up = function (knex, Promise) {
    return knex.schema.createTable('tissues', (table) => {
        table.increments('tissue_id')
            .primary();
        table.string('tissue_name')
            .notNullable();
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('tissues');
};
