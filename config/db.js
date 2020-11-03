const config = require('../knexfile.js')[process.env.NODE_ENV || "development"]

const knex = require('knex')(config)


//knex.migrate.latest([config])
//Quando add mais migrations, usar => knex migrate:latest

module.exports = knex