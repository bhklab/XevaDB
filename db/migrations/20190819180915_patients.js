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
                    table.integer('dataset_id')
                        .notNullable()
                        .unsigned()
                        .references('dataset_id')
                        .inTable('datasets')
                        .index();
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
