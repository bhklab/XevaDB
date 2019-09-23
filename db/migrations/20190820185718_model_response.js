
exports.up = function(knex, Promise) {
    return knex.schema.createTable('model_response', (table) => {
        table.increments();
        table.integer('drug_id')
             .notNullable()
             .unsigned()
             .references('drug_id')
             .inTable('drugs')
             .index();
        table.integer('model_id')
             .notNullable()
             .unsigned()
             .references('model_id')
             .inTable('models')
             .index();
        table.string('response_type')
             .notNullable();
        table.string('value').notNullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('model_response');
};