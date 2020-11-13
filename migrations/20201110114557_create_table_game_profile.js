
exports.up = async function(knex, Promise) {
    await knex.schema.createTable('game_profile', table=>{
       table.increments('id').primary()
       table.dateTime('createdAt').nullable()
       table.dateTime('updatedAt').nullable()
       table.dateTime('deletedAt').nullable()
       table.integer('userId').unsigned().references('id')
       .inTable('users').notNull().onDelete('CASCADE')
       table.integer('gameId').unsigned().references('id')
       .inTable('games').notNull().onDelete('CASCADE')
       table.string('name').notNull()
       table.integer('platformId').unsigned().references('id')
       .inTable('platforms').notNull().onDelete('CASCADE')
   })
};

exports.down = async function(knex, Promise) {
   await knex.schema.dropTable('game_profile')  
};