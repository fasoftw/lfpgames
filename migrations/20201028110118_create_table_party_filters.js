
exports.up = async function(knex, Promise) {
    await knex.schema.createTable('party_filters', table=>{
       table.increments('id').primary()
       table.dateTime('createdAt').nullable()
       table.dateTime('updatedAt').nullable()
       table.dateTime('deletedAt').nullable()
       table.integer('partyId').unsigned().references('id')
       .inTable('party').notNull()
       table.string('name').notNull()
   })
};

exports.down = async function(knex, Promise) {
   await knex.schema.dropTable('party_filters')  
};