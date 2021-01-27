const bcrypt = require('bcrypt-nodejs')


module.exports = app => {
    
    const { existsOrError, notExistsOrError, equalsOrError, passwordVal }  = app.api.validation

    const encryptPassword = (password) => {
        const salt = bcrypt.genSaltSync(10) 
        return bcrypt.hashSync(password, salt);
    }

    //Rota Save e Edit
    const save = async ( req, res ) => {
        
        const user = {...req.body}

        if(req.params.id) user.id = req.params.id  //Edit

        
        try{
        
            
            existsOrError(user.name, 'Enter your first name')
            existsOrError(user.lastName, 'Enter your last name')
            existsOrError(user.email, 'Enter your email')
            
            if(!user.id){
                
                existsOrError(user.password, 'Enter your password')
                existsOrError(user.confirmPassword, 'Enter your password')
                equalsOrError(user.password, user.confirmPassword, 'Passwords must match')
                passwordVal(user.password)

            } else if(user.id && user.password !== null){

                existsOrError(user.password, 'Enter your password')
                existsOrError(user.confirmPassword, 'Enter your password')
                equalsOrError(user.password, user.confirmPassword, 'Passwords must match')
                passwordVal(user.password)
            }
            
           

           

            

            const userFromDB = await app.db('users')
                .where({ email: user.email }).first()

        
            if(!user.id){ 
                notExistsOrError(userFromDB, 'Email address already in use')
            }

        }catch(msg){
            return res.status(400).send(msg)
        }

        
        user.password = encryptPassword(req.body.password)


        delete user.confirmPassword

        if(user.id){
            if(user.password === null){
                app.db('users')
                .update({name: user.name, lastName: user.lastName, email: user.email})
                .where({id: user.id})
                .then(_ => res.status(204).send()) 
                .catch(err => res.status(500).send(err)) 
            } else{
                app.db('users')
                .update(user)
                .where({id: user.id})
                .then(_ => res.status(204).send()) 
                .catch(err => res.status(500).send(err)) 
            }
            

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
            .select('id', 'name', 'lastName', 'email', 'password', 'admin')
            .whereNull('deletedAt')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const getById = ( req, res ) =>{
        app.db('users')
            .select('id', 'name', 'lastName', 'email', 'password', 'admin')
            .where({id: req.params.id})
            .whereNull('deletedAt')
            .first()
            .then(user => res.json(user))
            .catch(err => res.status(500).send(err))
    }

    const remove = async ( req, res ) => {
        try{
            await app.db('users')
            .where({ id: req.params.id })
            .del()
            .then(()=>  res.status(204).send())


            res.status(204).send()
        }catch(msg){
            res.status(400).send(msg)
        }
    }
    
    return { save, get, getById, remove }
}