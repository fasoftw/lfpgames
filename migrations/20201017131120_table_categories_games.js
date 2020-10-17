
exports.up = function(knex) {
    return knex.schema.createTable('categoriesGames', table => {
        table.increments('id').primary()
    })
};

exports.down = function(knex) {

    return knex.schema.dropTable('categoriesGames')
};
