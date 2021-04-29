
exports.up = (knex) => (
    knex.schema.hasTable('batches')
        .then((exists) => {
            let query = '';
            if (!exists) {
                query = knex.schema.createTable('batches', (table) => {
                    table.increments('batch_id')
                        .primary();
                    table.string('batch')
                        .notNullable();
                });
            }
            return query;
        })
        .catch((err) => {
            throw err;
        })
);

exports.down = (knex) => (
    knex.schema.dropTable('batches')
);
