
exports.up = async function(knex) {
    await knex.schema.createTable('games', table => {
        table.increments('id').primary()
        table.dateTime('createdAt').nullable();
        table.dateTime('updatedAt').nullable();
        table.dateTime('deletedAt').nullable();
        table.string('name').notNull()
        table.string('imageUrl', 1000).notNull()
        table.string('description',1000).notNull()
        table.integer('categoryId').unsigned().references('id')
            .inTable('categories').notNull()
        table.integer('maxPlayers').notNull()
        table.boolean('rank').notNull().defaultTo(false)
        table.integer('levelMax')
        }).then(async function () {
            await knex("games").insert([   
                {createdAt: new Date(), name: "Dota 2", imageUrl:"https://s2.glbimg.com/-q8MvinX_0xiDazd60GdPbioyH0=/1200x/smart/filters:cover():strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2019/l/Q/L8uEtSTYmy8JwFegBjiw/images-8-.jpg",
                 description: "Moba Online", categoryId:12, maxPlayers: 10, rank: 1}
            ]);
        }
      )
}
      

exports.down = async function(knex) {
    
   await knex.schema.dropTable('games')
  
};
