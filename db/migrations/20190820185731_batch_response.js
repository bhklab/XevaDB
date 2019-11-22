
exports.up = function (knex, Promise) {
    return knex.schema.createTable('batch_response', (table) => {
        table.increments('id')
            .primary();
        table.integer('drug_id')
            .notNullable()
            .unsigned()
            .references('drug_id')
            .inTable('drugs')
            .index();
        table.integer('batch_id')
            .notNullable()
            .unsigned()
            .references('batch_id')
            .inTable('batches')
            .index();
        table.string('response_type')
            .notNullable();
        table.string('value').notNullable();
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('batch_response');
};
