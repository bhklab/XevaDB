exports.up = (knex) => (
    knex.schema.hasTable('model_information')
        .then((exists) => {
            let query = '';
            if (!exists) {
                query = knex.schema.createTable('model_information', (table) => {
                    table.increments('id')
                        .primary();
                    table.integer('model_id')
                        .unsigned()
                        .unique()
                        .notNullable()
                        .references('model_id')
                        .inTable('models')
                        .index();
                    table.integer('tissue_id')
                        .notNullable()
                        .unsigned()
                        .references('tissue_id')
                        .inTable('tissues')
                        .index();
                    table.integer('patient_id')
                        .notNullable()
                        .unsigned()
                        .references('patient_id')
                        .inTable('patients')
                        .index();
                    table.integer('drug_id')
                        .notNullable()
                        .unsigned()
                        .references('drug_id')
                        .inTable('drugs')
                        .index();
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
    knex.schema.dropTable('model_information')
);
