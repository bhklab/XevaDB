exports.up = (knex) => (
    knex.schema.hasTable('tissues')
        .then((exists) => {
            let query = '';
            if (!exists) {
                query = knex.schema.createTable('tissues', (table) => {
                    table.increments('tissue_id')
                        .primary();
                    table.string('tissue_name')
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
    knex.schema.dropTable('tissues')
);
