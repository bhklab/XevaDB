
exports.up = function (knex, Promise) {
    return knex.schema.createTable('modelid_moleculardata_mapping', (table) => {
        table.increments('id')
            .primary();
        table.integer('model_id')
            .notNullable()
            .unsigned()
            .references('model_id')
            .inTable('models')
            .index();
        table.integer('sequencing_uid')
            .notNullable()
            .unsigned()
            .references('sequencing_uid')
            .inTable('sequencing')
            .index();
        table.string('mDataType')
            .notNullable();
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('modelid_moleculardata_mapping');
};
