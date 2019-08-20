exports.up = function(knex, Promise) {
    return knex.schema.createTable('model_information', (table) => {
        table.increments('model_id')
             .primary();
        table.string('model_name')
             .notNullable();
        table.integer('tissue_id')
             .notNullable()
             .unsigned()
             .references('tissue_id')
             .inTable('tissues')
             .index();
        table.integer('patient_id')
             .notNullable()
             .unsigned()
             .references('patient_id')
             .inTable('patients')
             .index();
        table.integer('drug_id')
             .notNullable()
             .unsigned()
             .references('drug_id')
             .inTable('drugs')
             .index();
        table.string('tested')
             .notNullable()
        table.integer('dataset_id')
             .notNullable()
             .unsigned()
             .references('dataset_id')
             .inTable('datasets')
             .index();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('model_information');
};
