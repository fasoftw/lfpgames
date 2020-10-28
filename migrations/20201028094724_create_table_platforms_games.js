
exports.up = async function(knex, Promise) {
    await knex.schema.createTable('platforms_games', table=>{
        table.increments('id').primary()
        table.dateTime('createdAt').nullable()
        table.dateTime('updatedAt').nullable()
        table.dateTime('deletedAt').nullable()
        table.integer('gameId').unsigned().references('id')
        .inTable('games').notNull()
        table.integer('platformId').unsigned().references('id')
        .inTable('platforms').notNull()

    })
};

exports.down = async function(knex, Promise) {
    await knex.schema.dropTable('platforms_games')
};
