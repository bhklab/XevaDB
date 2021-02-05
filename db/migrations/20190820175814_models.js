
exports.up = function (knex, Promise) {
    return knex.schema.createTable('models', (table) => {
        table.increments('model_id')
            .primary();
        table.string('model')
            .notNullable();
        table.integer('patient_id')
            .notNullable()
            .unsigned()
            .references('patient_id')
            .inTable('patients')
            .index();
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('models');
};
