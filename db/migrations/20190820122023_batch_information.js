
exports.up = function(knex, Promise) {
    return knex.schema.createTable('batch_information', (table) => {
        table.increments();
        table.string('batch_id').notNullable();
        table.integer('model_id')
             .notNullable()
             .unsigned()
             .references('model_id')
             .inTable('model_information')
             .index();
        table.string('type').notNullable();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('batch_information');
};
