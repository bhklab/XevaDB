
exports.up = function(knex, Promise) {
    return knex.schema.createTable('models', (table) => {
        table.increments('model_id')
             .primary();
        table.string('model')
             .notNullable();
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('models');
};
