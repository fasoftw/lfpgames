
exports.up = async function(knex) {
    await knex.schema.createTable('notifications',table=>{
        table.increments('id').primary()
        table.string('type').notNull()
        table.string('title').notNull()
        table.string('message').notNull()
    }).then(async function () {
        await knex("notifications").insert([
            {type: 'success', title: "Success created party", message:'Your party *name* was create with success. Please go the party to check new updates. Have fun!'},
            {type: 'success', title: "New user joined your party *name*", message:'New Player joined your party. Please go the party to check new updates. Have fun!'},
            {type: 'success', title: "Full party *name*", message:'Your party *name* spots was full filled. Go to the party to check party players and have fun!'},
            {type: 'success', title: 'You joined party *name*', message:'You joined party *name* with success. Please go to the party to check new updates. Have fun!'},
            {type: 'success', title: 'You left party *name*', message:'You left party *name* with success. If you want toojoin a new party, check new parties. Have fun!'}
        ]);
    })
};

exports.down = async function(knex) {
    await  knex.schema.dropTable('notifications')
};
