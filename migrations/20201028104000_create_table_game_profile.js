
exports.up = async function(knex, Promise) {
    await knex.schema.createTable('game_profile', table=>{
       table.increments('id').primary()
       table.dateTime('createdAt').nullable()
       table.dateTime('updatedAt').nullable()
       table.dateTime('deletedAt').nullable()
       table.integer('userId').unsigned().references('id')
       .inTable('users').notNull()
       table.integer('gameId').unsigned().references('id')
       .inTable('games').notNull()
       table.string('name').notNull()
       table.integer('platformId').unsigned().references('id')
       .inTable('platforms').notNull()
   })
};

exports.down = async function(knex, Promise) {
   await knex.schema.dropTable('game_profile')  
};