exports.up = (knex) => (
    knex.schema.hasTable('')
        .then((exists) => {
            let query = '';
            if (!exists) {
                query = knex.schema.createTable('model_sheets', (table) => {
                    table.string('model_id')
                        .notNullable();
                    table.string('link')
                        .notNullable();
                    table.string('row')
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
    knex.schema.dropTable('model_sheets')
);
