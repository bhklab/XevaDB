exports.up = (knex) => (
    knex.schema.hasTable('batch_information')
        .then((exists) => {
            let query = '';
            if (!exists) {
                query = knex.schema.createTable('batch_information', (table) => {
                    table.increments('id')
                        .primary();
                    table.integer('batch_id')
                        .notNullable()
                        .unsigned()
                        .references('batch_id')
                        .inTable('batches')
                        .index();
                    table.integer('model_id')
                        .notNullable()
                        .unsigned()
                        .references('model_id')
                        .inTable('models')
                        .index();
                    table.string('type').notNullable();
                });
            }
            return query;
        })
        .catch((err) => {
            throw err;
        })
);

exports.down = (knex) => (
    knex.schema.dropTable('batch_information')
);
