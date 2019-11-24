
exports.up = function (knex, Promise) {
    return knex.schema.createTable('users', (table) => {
        table.increments('user_id')
            .primary();
        table.string('user_name')
            .notNullable();
        table.string('user_pwd')
            .notNullable();
    });
};


exports.down = function (knex, Promise) {
    return knex.schema.dropTable('users');
};
