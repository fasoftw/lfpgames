
exports.up = async function(knex) {
    await knex.schema.createTable('games', table => {
        table.increments('id').primary()
        table.dateTime('createdAt').nullable();
        table.dateTime('updatedAt').nullable();
        table.dateTime('deletedAt').nullable();
        table.string('name').notNull()
        table.string('imageUrl', 1000).notNull()
        table.string('description',1000).notNull()
        table.integer('categoryId').unsigned().references('id')
            .inTable('categories').notNull().onDelete('CASCADE')
        table.integer('maxPlayers').notNull()
        table.boolean('rank').notNull().defaultTo(false)
        table.integer('levelMax')
        table.integer('plataformGameId').unsigned().references('id')
            .inTable('platforms_games').notNull().onDelete('CASCADE')
        })
};

exports.down = async function(knex) {
    
   await knex.schema.dropTable('games')
  
};
