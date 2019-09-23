
exports.up = function(knex, Promise) {
    return knex.schema.createTable('batch_information', (table) => {
        table.increments();
        table.integer('batch_id')
             .notNullable()
             .unsigned()
             .references('batch_id')
             .inTable('batches')
             .index();
        table.integer('model_id')
             .notNullable()
             .unsigned()
             .references('model_id')
             .inTable('models')
             .index();
        table.string('type').notNullable();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('batch_information');
};
