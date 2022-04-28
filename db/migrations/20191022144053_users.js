exports.up = (knex) => (
    knex.schema.hasTable('users')
        .then((exists) => {
            let query = '';
            if (!exists) {
                query = knex.schema.createTable('users', (table) => {
                    table.increments('user_id')
                        .primary();
                    table.string('user_name')
                        .notNullable();
                    table.string('user_pwd')
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
    knex.schema.dropTable('users')
);
