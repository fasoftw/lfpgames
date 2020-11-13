const queries = require('./queries')

module.exports = app => {
    
    const { existsOrError}  = app.api.validation

    const save = async (req,res) => {

        const profile = {...req.body}
       
        try{
            
            existsOrError(profile.name, 'Nome do filtro não informado')
            existsOrError(profile.gameId, 'Nome do game não informado') 
            existsOrError(profile.platformId,'Plataforma não informada')
            existsOrError(profile.userId, 'Erro')


            const platforms = await app.db.raw(queries.platformsGames,[profile.gameId, profile.userId,
                profile.platformId]) 
            
            //const ids = platforms.id.map(c => c)
            console.log(platforms[0])
      
                       
            

        }catch(err){
            return res.status(400).send(err)
        }

        if(!req.params.id){
            profile.createdAt = new Date();
            app.db('game_profile')
            .insert({createdAt: new Date(), name: profile.name, gameId: profile.gameId, 
                userId: profile.userId, platformId: profile.platformId })
            .then(_ => res.status(201).send())
            .catch(err => res.status(500).send(err))
        } else{
            profile.updatedAt = new Date();
            app.db('game_profile')
            .insert({updatedAt: new Date(), name: profile.name, gameId: profile.gameId, 
                userId: profile.userId, platformId: profile.platformId })
            .where({id: req.params.id})
            .then(_ => res.status(201).send())
            .catch(err => res.status(500).send(err))

        }


    }

    const getById = (req,res) =>{
        app.db("game_profile")
        .select('*')
        .whereNull("game_profile.deletedAt")
        .where({"game_profile.id": req.params.id})
        .then(profile => res.json(profile))
        .catch(err => res.status(500).send(err))   
    }
    
  
    return {save,getById}

}
