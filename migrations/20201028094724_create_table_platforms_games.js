
exports.up = async function(knex, Promise) {
    await knex.schema.createTable('platforms_games', table=>{
        table.increments('id').primary()
        table.dateTime('createdAt').nullable()
        table.dateTime('updatedAt').nullable()
        table.dateTime('deletedAt').nullable()
        table.integer('gameId').unsigned().references('id')
        .inTable('games').notNull().onDelete('CASCADE') 
        table.integer('platformId').unsigned().references('id')
        .inTable('platforms').notNull().onDelete('CASCADE') 

    }).then(async function () {
        await knex("platforms_games").insert([   
            {createdAt: new Date(), gameId: 1, platformId:1},
            {createdAt: new Date(), gameId: 2, platformId:4},
            {createdAt: new Date(), gameId: 3, platformId:10},
            {createdAt: new Date(), gameId: 4, platformId:11}
    ]);
  }
)
}

exports.down = async function(knex, Promise) {
    await knex.schema.dropTable('platforms_games')
};
