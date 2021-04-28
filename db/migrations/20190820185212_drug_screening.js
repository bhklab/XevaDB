exports.up = (knex) => (
    knex.schema.hasTable('')
        .then((exists) => {
            let query = '';
            if (!exists) {
                query = knex.schema.createTable('drug_screening', (table) => {
                    table.increments('id')
                        .primary();
                    table.integer('model_id')
                        .unsigned()
                        .notNullable()
                        .references('model_id')
                        .inTable('models')
                        .index();
                    table.integer('drug_id')
                        .unsigned()
                        .notNullable()
                        .references('drug_id')
                        .inTable('drugs')
                        .index();
                    table.decimal('time').notNullable();
                    table.decimal('volume').notNullable();
                    table.decimal('volume_normal', 64, 16).notNullable();
                });
            }
            return query;
        })
        .catch((err) => {
            throw err;
        })
);

exports.down = (knex) => (
    knex.schema.dropTable('drug_screening')
);
