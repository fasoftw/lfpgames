const config = require('../knexfile.js')

const knex = require('knex')(config)


//Quando add mais migrations, usar => knex migrate:latest

module.exports = knex