
exports.up = async function(knex) {
    await knex.schema.createTable('party_players', table=>{
        table.increments('id').primary()
        table.dateTime('createdAt').nullable()
        table.dateTime('updatedAt').nullable()
        table.dateTime('deletedAt').nullable()
        table.integer('userId').unsigned().references('id')
            .inTable('users').notNull().onDelete('CASCADE') 
        table.integer('partyId').unsigned().references('id')
            .inTable('party').notNull().onDelete('CASCADE') 
        table.integer('gameProfileId').unsigned().references('id')
            .inTable('game_profile').notNull().onDelete('CASCADE') 
    })
};

exports.down = async function(knex) {
    await knex.schema.dropTable('party_players')
};
