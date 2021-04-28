exports.up = (knex) => (
    knex.schema.hasTable('')
        .then((exists) => {
            let query = '';
            if (!exists) {
                query = knex.schema.createTable('drug_annotations', (table) => {
                    table.integer('drug_id')
                        .unsigned()
                        .unique()
                        .notNullable()
                        .references('drug_id')
                        .inTable('drugs')
                        .index();
                    table.string('standard_name');
                    table.string('targets');
                    table.string('treatment_type');
                    table.string('class');
                    table.string('class_name');
                    table.string('pubchemid');
                });
            }
            return query;
        })
        .catch((err) => {
            throw err;
        })
);

exports.down = (knex) => (
    knex.schema.dropTable('drug_annotations')
);
