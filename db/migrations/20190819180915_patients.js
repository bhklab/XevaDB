exports.up = (knex) => (
    knex.schema.hasTable('patients')
        .then((exists) => {
            let query = '';
            if (!exists) {
                query = knex.schema.createTable('patients', (table) => {
                    table.increments('patient_id')
                        .primary();
                    table.string('patient')
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
    knex.schema.dropTable('patients')
);
