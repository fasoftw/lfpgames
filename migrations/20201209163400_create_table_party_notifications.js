
exports.up = async function(knex, Promise) {
    await knex.schema.createTable('party_notifications',table=>{
        table.increments('id').primary()
        table.datetime('readedAt')
        table.datetime('createdAt').notNull()
        table.string('nameParty')
        table.integer('notificationId').unsigned().references('id')
        .inTable('notifications').notNull().onDelete('CASCADE')
        table.integer('userId').unsigned().references('id')
        .inTable('users').onDelete('CASCADE')
    })
};

exports.down = async function(knex, Promise) {
    await  knex.schema.dropTable('party_notifications')
};
