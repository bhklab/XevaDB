exports.up = (knex) => (
    knex.schema.hasTable('model_response')
        .then((exists) => {
            let query = '';
            if (!exists) {
                query = knex.schema.createTable('model_response', (table) => {
                    table.increments('id')
                        .primary();
                    table.integer('drug_id')
                        .notNullable()
                        .unsigned()
                        .references('drug_id')
                        .inTable('drugs')
                        .index();
                    table.integer('model_id')
                        .notNullable()
                        .unsigned()
                        .references('model_id')
                        .inTable('models')
                        .index();
                    table.string('response_type')
                        .notNullable();
                    table.string('value').notNullable().defaultTo('');
                });
            }
            return query;
        })
        .catch((err) => {
            throw err;
        })
);

exports.down = (knex) => (
    knex.schema.dropTable('model_response')
);
