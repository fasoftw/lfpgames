//Tabela Users
exports.up = async function(knex, Promise) {
    await knex.schema.createTable('users', table => {

        table.increments('id').primary()
        table.dateTime('createdAt').nullable();
        table.dateTime('updatedAt').nullable();
        table.dateTime('deletedAt').nullable();
        table.string('name').notNull()
        table.string('lastName').notNull()
        table.string('email').notNull()
        table.string('password').notNull()
        table.string('imageUrl', 1000)
        table.boolean('admin').notNull().defaultTo(false) 
    })
};

exports.down = async function(knex, Promise) {
    await knex.schema.dropTable('users')
};