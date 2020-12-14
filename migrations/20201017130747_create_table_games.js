
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
            .inTable('categories').notNull().onDelete('CASCADE') 
        table.integer('maxPlayers').notNull()
        table.boolean('rank').notNull().defaultTo(false)
        table.integer('levelMax')
        }).then(async function () {
            await knex("games").insert([   
                {createdAt: new Date(), name: "Dota 2", imageUrl:"https://s2.glbimg.com/-q8MvinX_0xiDazd60GdPbioyH0=/1200x/smart/filters:cover():strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2019/l/Q/L8uEtSTYmy8JwFegBjiw/images-8-.jpg",
                 description: "Moba Online", categoryId:12, maxPlayers: 10, rank: 1},
                 {createdAt: new Date(), name: "World Of Warcraft", imageUrl:"https://ovicio.com.br/wp-content/uploads/2020/09/20200926-world-of-warcraft-shadowlands-1200x675.jpg",
                 description: "MMO RPG Online", categoryId:6, maxPlayers: 10, rank: 1},
                 {createdAt: new Date(), name: "Pokemon Go", imageUrl:"https://s2.glbimg.com/31YVkEVL6XMOJZfawKtDYFKZdVc=/0x0:1200x675/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2020/F/n/BzsmQRSLqhGHkqUbxNoA/pokemon-go.jpg",
                 description: "Pokemon Simulation Online", categoryId:10, maxPlayers: 10, rank:0},
                 {createdAt: new Date(), name: "Valorant", imageUrl:"https://s2.glbimg.com/nMnevy2-ElNulNgmqj9BMVpr1Z4=/0x0:5120x2880/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228b6673f488aa253bbcb03c80ec5/internal_photos/bs/2020/d/h/OYQw1UTmWAoTA2Rk9EhQ/valorant.jpg",
                 description: "Shooter Game", categoryId:1, maxPlayers: 10, rank: 1}
            ]);
        }
      )
}
      

exports.down = async function(knex) {
    
   await knex.schema.dropTable('games')
  
};
