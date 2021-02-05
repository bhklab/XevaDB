
exports.up = function (knex, Promise) {
    return knex.schema.createTable('model_sheets', (table) => {
        table.string('model_id')
            .notNullable();
        table.string('link')
            .notNullable();
        table.string('row')
            .notNullable();
    });
};


exports.down = function (knex, Promise) {
    return knex.schema.dropTable('model_sheets');
};
