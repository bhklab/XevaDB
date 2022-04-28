exports.up = (knex) => (
    knex.schema.hasTable('gene_drug_tissue')
        .then((exists) => {
            let query = '';
            if (!exists) {
                query = knex.schema.createTable('gene_drug_tissue', (table) => {
                    table.increments('id')
                        .primary();
                    table.integer('gene_id')
                        .notNullable()
                        .unsigned()
                        .references('gene_id')
                        .inTable('genes')
                        .index();
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
                    table.integer('tissue_id')
                        .notNullable()
                        .unsigned()
                        .references('tissue_id')
                        .inTable('tissues')
                        .index();
                    table.decimal('estimate', 16, 8);
                    table.decimal('ci_lower', 16, 8);
                    table.decimal('ci_upper', 16, 8);
                    table.decimal('pvalue', 16, 8);
                    table.decimal('fdr', 16, 8);
                    table.integer('n');
                    table.string('mDataType');
                    table.string('metric');
                })
            }
            return query;
        })
        .catch((err) => {
            throw err;
        })
);

exports.down = (knex) => (
    knex.schema.dropTable('gene_drug_tissue')
);
