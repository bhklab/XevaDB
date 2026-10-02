exports.up = (knex) => (
    knex.schema.hasTable('datasets')
        .then((exists) => {
            let query = '';
            if (!exists) {
                query = knex.schema.createTable('datasets', (table) => {
                    table.increments('dataset_id')
                        .primary();
                    table.string('dataset_name')
                        .notNullable();
                    table.boolean('private')
                        .notNullable()
                        .defaultTo(false);
                });
            }
            return query;
        })
        .catch((err) => {
            throw err;
        })
);

exports.down = (knex) => (
    knex.schema.dropTable('datasets')
);
