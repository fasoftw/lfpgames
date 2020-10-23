const bcrypt = require('bcrypt-nodejs')


module.exports = app => {
    
    const { existsOrError, notExistsOrError, equalsOrError }  = app.api.validation

    const encryptPassword = (password) => {
        const salt = bcrypt.genSaltSync(10) 
        return bcrypt.hashSync(password, salt);
    }

    //Rota Save e Edit
    const save = async ( req, res ) => {
        
        const user = {...req.body}

        if(req.params.id) user.id = req.params.id  //Edit

        
        try{
            
            
            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.email, 'Email não informado')
            existsOrError(user.password, 'Senha não informada')
            existsOrError(user.confirmPassword, 'Confirmação de senha não informada')
            equalsOrError(user.password, user.confirmPassword, 'Senhas não conferem')


            const userFromDB = await app.db('users')
                .where({ email: user.email }).first()

        
            if(!user.id){ 
                notExistsOrError(userFromDB, 'Usuário já cadastrado')
            }

        }catch(msg){
            return res.status(400).send(msg)
        }

        
        user.password = encryptPassword(req.body.password)


        delete user.confirmPassword

        if(user.id){
            app.db('users')
                .update(user)
                .where({id: user.id})
                .then(_ => res.status(204).send()) 
                .catch(err => res.status(500).send(err)) 

        }else{
            app.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err)) 

        }
    }


    //Rota get e getById

    const get = ( req, res ) =>{
        app.db('users')
            .select('id', 'name', 'email', 'password', 'admin')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const getById = ( req, res ) =>{
        app.db('users')
            .select('id', 'name', 'email', 'password', 'admin')
            .where({id: req.params.id})
            .first()
            .then(user => res.json(user))
            .catch(err => res.status(500).send(err))
    }

    const remove = async ( req, res ) => {
        try{
            existsOrError(req.params.id, 'Código do usuário não informado.')
            
            const rowsDeleted = await app.db('users')
                .where({ id: req.params.id }).del()
            existsOrError(rowsDeleted, 'Usuário não foi encontrado.')

            console.log(rowsDeleted)

            res.status(204).send()
        }catch(msg){
            res.status(400).send(msg)
        }
        app.db('users')
            .delete(user)
            .where({id: user.id})
    }
    
    return { save, get, getById, remove }
}