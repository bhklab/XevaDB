exports.up = (knex) => (
    knex.schema.hasTable('datasets_tissues')
        .then((exists) => {
            let query = '';
            if (!exists) {
                query = knex.schema.createTable('datasets_tissues', (table) => {
                    table.integer('dataset_id')
                        .notNullable()
                        .unsigned()
                        .references('dataset_id')
                        .inTable('datasets')
                        .index();
                    table.integer('tissue_id')
                        .notNullable()
                        .unsigned()
                        .references('tissue_id')
                        .inTable('tissues')
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
    knex.schema.dropTable('datasets_tissues')
);
