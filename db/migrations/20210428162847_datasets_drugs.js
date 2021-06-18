exports.up = (knex) => (
    knex.schema.hasTable('datasets_drugs')
        .then((exists) => {
            let query = '';
            if (!exists) {
                query = knex.schema.createTable('datasets_drugs', (table) => {
                    table.integer('dataset_id')
                        .notNullable()
                        .unsigned()
                        .references('dataset_id')
                        .inTable('datasets')
                        .index();
                    table.integer('drug_id')
                        .notNullable()
                        .unsigned()
                        .references('drug_id')
                        .inTable('drugs')
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
    knex.schema.dropTable('datasets_drugs')
);
