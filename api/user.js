const bcrypt = require('bcrypt-nodejs')

module.exports = app => {

    //Rota save e edit


    //Rota get e getById
    const get = ( res, req ) =>{
        app.db('users')
            .select('id', 'name', 'email', 'password', 'admin')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const getById = ( res, req ) =>{
        app.db('users')
            .select('id', 'name', 'email', 'password', 'admin')
            .where({id: res.params.id})
            .first()
            .then(user => res.json(user))
            .catch(err => res.status(500).send(err))
    }


    //Rota Remove

    return {}
}