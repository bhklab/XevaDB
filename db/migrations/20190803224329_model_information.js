exports.up = function(knex, Promise) {
    return knex.schema.createTable('model_information', (table) => {
        table.string('model_id').primary();
        table.string('tissue_id').notNullable();
        table.string('tissue').notNullable();
        table.string('patient_id')
             .notNullable()
             .references('patient_id')
             .inTable('patient_information')
             .index();
        table.string('drug')
             .notNullable()
             .references('drug_id')
             .inTable('drug')
             .index();
        table.string('tested')
             .notNullable()
        table.integer('dataset')
             .notNullable()
             .references('dataset_id')
             .inTable('datasets')
             .index();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('model_information');
};
