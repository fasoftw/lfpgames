
exports.up = async function(knex, Promise) {
    await knex.schema.createTable('articles', table => {
        table.increments('id').primary()
        table.dateTime('createdAt').nullable()
        table.dateTime('updatedAt').nullable()
        table.dateTime('deletedAt').nullable()
        table.string('name').notNull()
        table.string('description', 1000).notNull()
        table.string('imageUrl', 1000)
        table.binary('content').notNull()
        table.integer('userId').unsigned().references('id')
            .inTable('users').notNull()
    })
};

exports.down = async function(knex, Promise) {
    await  knex.schema.dropTable('articles')
};