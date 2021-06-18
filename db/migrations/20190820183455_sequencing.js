exports.up = (knex) => (
    knex.schema.hasTable('sequencing')
        .then((exists) => {
            let query = '';
            if (!exists) {
                query = knex.schema.createTable('sequencing', (table) => {
                    table.increments('sequencing_uid')
                        .primary();
                    table.string('sequencing_id')
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
    knex.schema.dropTable('sequencing')
);
