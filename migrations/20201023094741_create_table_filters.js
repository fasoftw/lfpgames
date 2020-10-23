
exports.up = async function(knex, Promise) {
     await knex.schema.createTable('filters', table=>{
        table.increments('id').primary()
        table.dateTime('createdAt').nullable();
        table.dateTime('updatedAt').nullable();
        table.dateTime('deletedAt').nullable();
        table.integer('gamesId').unsigned().references('id')
        .inTable('games').notNull()
        table.string('filter1')
        table.string('filter2')
        table.string('filter3')
        table.string('filter4')
        table.string('filter5')
        table.string('filter6')
        table.string('filter7')
        table.string('filter8')
        table.string('filter9')
        table.string('filter10')
    })
};

exports.down = async function(knex, Promise) {
    await knex.schema.dropTable('filters')  
};