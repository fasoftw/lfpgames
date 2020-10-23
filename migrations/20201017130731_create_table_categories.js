
exports.up = async function(knex, Promise) {
    await knex.schema.createTable('categories', table => {
        table.increments('id').primary()
        table.dateTime('createdAt').nullable();
        table.dateTime('updatedAt').nullable();
        table.dateTime('deletedAt').nullable();
        table.string('name').notNull()
    })
}

exports.down = async function(knex, Promise) {
    await knex.schema.dropTable('categories')
};