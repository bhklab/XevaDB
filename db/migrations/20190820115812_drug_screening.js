
exports.up = function(knex, Promise) {
    return knex.schema.createTable('drug_screening', (table) => {
        table.increments();
        table.integer('model_id')
             .unsigned()
             .notNullable()
             .references('model_id')
             .inTable('model_information')
             .index();
        table.integer('drug_id')
             .unsigned()
             .notNullable()
             .references('drug_id')
             .inTable('drugs')
             .index();
        table.decimal('time').notNullable();
        table.decimal('volume').notNullable();
        table.decimal('volume_normal',64,16).notNullable();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('drug_screening');
};