
exports.up = function (knex, Promise) {
    return knex.schema.createTable('drugs', (table) => {
        table.increments('drug_id')
            .primary();
        table.string('drug_name').notNullable();
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('drugs');
};
