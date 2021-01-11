
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
                {createdAt: new Date(), name: "Dota 2", imageUrl:"dota",
                 description: "Moba Online", categoryId:5, maxPlayers: 5, rank: 1},
                 {createdAt: new Date(), name: "League of Legends", imageUrl:"lol",
                 description: "Moba Online", categoryId:5, maxPlayers: 5, rank: 1},
                 {createdAt: new Date(), name: "World Of Warcraft", imageUrl:"wow",
                 description: "MMO RPG Online", categoryId:6, maxPlayers: 10, rank: 1},
                 {createdAt: new Date(), name: "Pokemon Go", imageUrl:"pokemon",
                 description: "Pokemon Simulation Online", categoryId:12, maxPlayers: 20, rank:0},
                 {createdAt: new Date(), name: "Valorant", imageUrl:"valorant",
                 description: "FPS Shooter Game", categoryId:4, maxPlayers: 5, rank: 1},
                 {createdAt: new Date(), name: "Counter Striker", imageUrl:"cs",
                 description: "FPS Shooter Game", categoryId:4, maxPlayers: 5, rank: 1},
                 {createdAt: new Date(), name: "Overwatch", imageUrl:"ow",
                 description: "FPS Shooter Game", categoryId:4, maxPlayers: 5, rank: 1},
                 {createdAt: new Date(), name: "Fortnite", imageUrl:"fortnite",
                 description: "Shooter Action", categoryId:9, maxPlayers: 5, rank: 1},
                 {createdAt: new Date(), name: "Diablo III", imageUrl:"diablo",
                 description: "RPG Action", categoryId:14, maxPlayers: 10, rank: 1},
                 {createdAt: new Date(), name: "Apex Legends", imageUrl:"apex",
                 description: "FPS Shooter Game", categoryId:4, maxPlayers: 10, rank: 1},

            ]);
        }
      )
}
      

exports.down = async function(knex) {
    
   await knex.schema.dropTable('games')
  
};
