exports.up = function (knex, Promise) {
    return knex.schema.createTable('patients', (table) => {
        table.increments('patient_id')
            .primary();
        table.string('patient')
            .notNullable();
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('patients');
};
