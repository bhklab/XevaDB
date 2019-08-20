
exports.up = function(knex, Promise) {
    return knex.schema.createTable('batch_response', (table) => {
        table.increments();
        table.integer('batch_id')
             .notNullable()
             .unsigned()
             .references('batch_id')
             .inTable('batch_information')
             .index();
        table.string('response_type')
             .notNullable();
        table.string('value').notNullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('batch_response');
};