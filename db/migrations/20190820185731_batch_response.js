exports.up = (knex) => (
    knex.schema.hasTable('')
        .then((exists) => {
            let query = '';
            if (!exists) {
                query = knex.schema.createTable('batch_response', (table) => {
                    table.increments('id')
                        .primary();
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
            }
            return query;
        })
        .catch((err) => {
            throw err;
        })
);

exports.down = (knex) => (
    knex.schema.dropTable('batch_response')
);
