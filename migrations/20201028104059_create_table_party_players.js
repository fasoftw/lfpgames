
exports.up = async function(knex) {
    await knex.schema.createTable('party_players', table=>{
        table.increments('id').primary()
        table.dateTime('createdAt').nullable()
        table.dateTime('updatedAt').nullable()
        table.dateTime('deletedAt').nullable()
        table.integer('userId').unsigned().references('id')
            .inTable('users').notNull()
        table.integer('partyId').unsigned().references('id')
            .inTable('party').notNull()
    })
};

exports.down = async function(knex) {
    await knex.schema.dropTable('party_players')
};
