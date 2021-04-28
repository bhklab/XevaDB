
exports.up = (knex) => (
    knex.schema.hasTable('genes')
        .then((exists) => {
            let query = '';
            if (!exists) {
                query = knex.schema.createTable('genes', (table) => {
                    table.increments('gene_id')
                        .primary();
                    table.string('gene_name')
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
    knex.schema.dropTable('genes')
);
