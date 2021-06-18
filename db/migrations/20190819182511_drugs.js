exports.up = (knex) => (
    knex.schema.hasTable('drugs')
        .then((exists) => {
            let query = '';
            if (!exists) {
                query = knex.schema.createTable('drugs', (table) => {
                    table.increments('drug_id')
                        .primary();
                    table.string('drug_name')
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
    knex.schema.dropTable('drugs')
);
