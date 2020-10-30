
exports.up = async function(knex, Promise) {
     await knex.schema.createTable('filters', table=>{
        table.increments('id').primary()
        table.dateTime('createdAt').nullable()
        table.dateTime('updatedAt').nullable()
        table.dateTime('deletedAt').nullable()
        table.integer('gameId').unsigned().references('id')
        .inTable('games').notNull().onDelete('CASCADE')
        table.string('name').notNull()
        table.string('fillField')
        table.boolean('notNull')
    })
};

exports.down = async function(knex, Promise) {
    await knex.schema.dropTable('filters')  
};