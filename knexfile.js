module.exports = {

  development: {
    client: 'mysql',
    connection: {
      database:'lfpgames',
      user:'root',
      password:'root',
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }

  },

  production:{
    client: 'mysql',
    connection: {
      port: 41890,
      host:'mysql741.umbler.com',
      database:'lfpgames',
      user:'fasoft',
      password:'Startup93',
    }
  }

  
};
