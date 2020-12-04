
exports.up = async function(knex, Promise) {
     await knex.schema.createTable('filters', table=>{
        table.increments('id').primary()
        table.dateTime('createdAt').nullable()
        table.dateTime('updatedAt').nullable()
        table.dateTime('deletedAt').nullable()
        table.integer('gameId').unsigned().references('id')
        .inTable('games').notNull().onDelete('CASCADE') 
        table.string('name').notNull()
    }).then(async function () {
        await knex("filters").insert([   
            {createdAt: new Date(), gameId:1, name:"Support"},
            {createdAt: new Date(), gameId:1, name:"Midlane"}
    ]);
  }
)
}

exports.down = async function(knex, Promise) {
    await knex.schema.dropTable('filters')  
};