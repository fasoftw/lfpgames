
exports.up = async function(knex, Promise) {
    await knex.schema.createTable('party', table=>{
        table.increments('id').primary()
        table.integer('gameId').unsigned().references('id')
        .inTable('games').notNull()
        table.integer('platformId').unsigned().references('id')
        .inTable('platforms_games').notNull()
        table.integer('userId').unsigned().references('id')
        .inTable('users').notNull()
        table.integer('numberPlayers').notNull()
        table.integer('rank')
        table.integer('level')

        //party_filters tem dependencia com party

    })
};

exports.down = async function(knex, Promise) {
    await knex.schema.dropTable('party')
};
