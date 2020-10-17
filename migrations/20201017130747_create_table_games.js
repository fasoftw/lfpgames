
exports.up = function(knex) {
    return knex.schema.createTable('games', table => {
        table.increments('id').primary()
    })
};

exports.down = function(knex) {
    
    return knex.schema.dropTable('games')
  
};
