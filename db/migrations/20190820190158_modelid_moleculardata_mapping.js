exports.up = (knex) => (
    knex.schema.hasTable('')
        .then((exists) => {
            let query = '';
            if (!exists) {
                query = knex.schema.createTable('modelid_moleculardata_mapping', (table) => {
                    table.increments('id')
                        .primary();
                    table.integer('model_id')
                        .notNullable()
                        .unsigned()
                        .references('model_id')
                        .inTable('models')
                        .index();
                    table.integer('sequencing_uid')
                        .notNullable()
                        .unsigned()
                        .references('sequencing_uid')
                        .inTable('sequencing')
                        .index();
                    table.string('mDataType')
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
    knex.schema.dropTable('modelid_moleculardata_mapping')
);
