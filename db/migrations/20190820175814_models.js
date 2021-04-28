exports.up = (knex) => (
    knex.schema.hasTable('models')
        .then((exists) => {
            let query = '';
            if (!exists) {
                query = knex.schema.createTable('models', (table) => {
                    table.increments('model_id')
                        .primary();
                    table.string('model')
                        .notNullable();
                    table.integer('patient_id')
                        .notNullable()
                        .unsigned()
                        .references('patient_id')
                        .inTable('patients')
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
    knex.schema.dropTable('models')
);
