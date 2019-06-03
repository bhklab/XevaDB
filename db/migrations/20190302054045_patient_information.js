
exports.up = function(knex, Promise) {
  return knex.schema.createTable("patient_information", (table) => {
      table.string("patient_id").primary();
      table.string("sex");
      table.integer("age");
      table.string("biopsy");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("patient_information");
};
