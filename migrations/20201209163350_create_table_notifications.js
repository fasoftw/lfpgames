
exports.up = async function(knex) {
    await knex.schema.createTable('notifications',table=>{
        table.increments('id').primary()
        table.string('type').notNull()
        table.string('title').notNull()
        table.string('message').notNull()
    }).then(async function () {
        await knex("notifications").insert([
            {type: 'success', title: "Success created party", message:'Your party *name* was create with success - *date* /n Please go the party to check new updates. Have fun!'}
         
        ]);
    })
};

exports.down = async function(knex) {
    await  knex.schema.dropTable('notifications')
};
