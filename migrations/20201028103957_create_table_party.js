
exports.up = async function(knex, Promise) {
    await knex.schema.createTable('party', table=>{
        table.increments('id').primary()
        table.dateTime('createdAt').nullable()
        table.dateTime('updatedAt').nullable()
        table.dateTime('deletedAt').nullable()
        table.string('name').notNull()
        table.string('description')
        table.integer('gameId').unsigned().references('id')
        .inTable('games').notNull().onDelete('CASCADE') 
        table.integer('platformId').unsigned().references('id')
        .inTable('platforms_games').notNull().onDelete('CASCADE') 
        table.integer('userId').unsigned().references('id')
        .inTable('users').notNull().onDelete('CASCADE') 
        table.integer('isOpen').notNull()
        table.integer('numberPlayers').notNull()
        table.integer('rank')
        table.integer('level')
        table.integer('spotsFilled')
        table.boolean('ready').defaultTo(false)

        //party_filters tem dependencia com party

    })
};

exports.down = async function(knex, Promise) {
    await knex.schema.dropTable('party')
};
