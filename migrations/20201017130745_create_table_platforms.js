
exports.up = async function(knex, Promise) {

    await knex.schema.createTable('platforms', table=>{
        table.increments('id').primary()
        table.dateTime('createdAt').nullable();
        table.dateTime('updatedAt').nullable();
        table.dateTime('deletedAt').nullable();
        table.string('name').notNull()

        }).then(async function () {
                await knex("platforms").insert([
                    {createdAt: new Date(), name: "Steam"},
                    {createdAt: new Date(), name: "Epic Games"},
                    {createdAt: new Date(), name: "Origin"},
                    {createdAt: new Date(), name: "Battle.net"},
                    {createdAt: new Date(), name: "uPlay"},
                    {createdAt: new Date(), name: "Riot Games"},
                    {createdAt: new Date(), name: "Xbox Live"},
                    {createdAt: new Date(), name: "Playstation Network"},
                    {createdAt: new Date(), name: "Nintendo Switch Online"},
                    {createdAt: new Date(), name: "Android/IOS"},
                    {createdAt: new Date(), name: "PC"},

                ]);
            }
        )
};

exports.down = async function(knex) {
    await knex.schema.dropTable('platforms')  
};
