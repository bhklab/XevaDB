
exports.up = function (knex, Promise) {
    return knex.schema.createTable('drug_annotations', (table) => {
        table.integer('drug_id')
            .unsigned()
            .unique()
            .notNullable()
            .references('drug_id')
            .inTable('drugs')
            .index();
        table.string('standard_name');
        table.string('targets');
        table.string('treatment_type');
        table.string('class');
        table.string('class_name');
        table.string('source');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('drug_annotations');
};
