
exports.up = function(knex, Promise) {
    return knex.schema.createTable('batch_information', (table) => {
        table.increments();
        table.string('batch').notNullable();
        table.string('model_id')
             .notNullable()
             .references('model_id')
             .inTable('model_information')
             .index();
        table.string('type').notNullable();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('batch_information');
};
