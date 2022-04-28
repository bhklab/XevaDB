exports.up = (knex) => (
    knex.schema.hasTable('rna_sequencing')
        .then((exists) => {
            let query = '';
            if (!exists) {
                query = knex.schema.createTable('rna_sequencing', (table) => {
                    table.increments('id')
                        .primary();
                    table.integer('gene_id')
                        .notNullable()
                        .unsigned()
                        .references('gene_id')
                        .inTable('genes')
                        .index();
                    table.integer('sequencing_uid')
                        .notNullable()
                        .unsigned()
                        .references('sequencing_uid')
                        .inTable('sequencing')
                        .index();
                    table.string('value').notNullable();
                });
            }
            return query;
        })
        .catch((err) => {
            throw err;
        })
);

exports.down = (knex) => (
    knex.schema.dropTable('rna_sequencing')
);
