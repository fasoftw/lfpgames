
exports.up = async function(knex, Promise) {

    await knex.schema.createTable('platforms', table=>{
        table.increments('id').primary()
        table.dateTime('createdAt').nullable();
        table.dateTime('updatedAt').nullable();
        table.dateTime('deletedAt').nullable();
        table.string('name').notNull()

        }).then(async function () {
                await knex("platforms").insert([
                    {createdAt: new Date(), name: "Nintendo"},
                    {createdAt: new Date(), name: "Xbox"},
                    {createdAt: new Date(), name: "Playstation"},
                    {createdAt: new Date(), name: "PC"},
                    {createdAt: new Date(), name: "Android"},
                    {createdAt: new Date(), name: "iOS"}  
                ]);
            }
        )
};

exports.down = async function(knex) {
    await knex.schema.dropTable('platforms')  
};
