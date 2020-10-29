
exports.up = async function(knex, Promise) {
    await knex.schema.createTable('categories', table => {
        table.increments('id').primary()
        table.dateTime('createdAt').nullable();
        table.dateTime('updatedAt').nullable();
        table.dateTime('deletedAt').nullable();
        table.string('name').notNull()
    }).then(async function () {
        await knex("categories").insert([
            {createdAt: new Date(), name: "Shooter"},
            {createdAt: new Date(), name: "Fighting"},
            {createdAt: new Date(), name: "Beat'em ups"},
            {createdAt: new Date(), name: "Stealth"},
            {createdAt: new Date(), name: "Survival horror"},
            {createdAt: new Date(), name: "MMORPG"},
            {createdAt: new Date(), name: "Tactical RPG"},
            {createdAt: new Date(), name: "Battleground"},
            {createdAt: new Date(), name: "Sandbox RPG"},
            {createdAt: new Date(), name: "Simulation"},
            {createdAt: new Date(), name: " Strategy"}  
        ]);
    }
)
}

exports.down = async function(knex, Promise) {
    await knex.schema.dropTable('categories')
};