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



        }catch(err){
            return res.status(400).send(err)
        }

        console.log(profile)
        
        const platforms = await app.db.raw(queries.platformsGames,[profile.gameId, profile.userId,
            profile.platformId]) 

            console.log(platforms)

        if(!req.params.id && (platforms[0].length == 0)){

            profile.createdAt = new Date();
            app.db('game_profile')
            .insert({createdAt: new Date(), name: profile.name, gameId: profile.gameId, 
                userId: profile.userId, platformId: profile.platformId })
            .then(_ => res.status(201).send())
            .catch(err => res.status(500).send(err))

        } else if(!req.params.id && (platforms[0].length >= 1)){

            profile.updatedAt = new Date();
            app.db('game_profile')
            .update({updatedAt: new Date(), name: profile.name, gameId: profile.gameId, 
                userId: profile.userId, platformId: profile.platformId })
            .where({platformId: profile.platformId}, 
                {userId: profile.userId}, {gameId: profile.gameId})
            .then(_ => res.status(201).send())
            .catch(err => res.status(500).send(err))

        } else if(req.params.id ){
            profile.updatedAt = new Date();
            app.db('game_profile')
            .update({updatedAt: new Date(), name: profile.name, gameId: profile.gameId, 
                userId: profile.userId, platformId: profile.platformId })
            .where({id: req.params.id})
            .then(_ => res.status(201).send())
            .catch(err => res.status(500).send(err))
        }


    }
    
    const get = (req,res) =>{
        app.db("game_profile")
        .select('game_profile.*','games.name as gameName', 'platforms.name as platformName')
        .join("users", "users.id", "game_profile.userId")
        .join("games", "games.id", "game_profile.gameId")
        .join("platforms", "platforms.id", "game_profile.platformId")
        .join("platforms_games", "platforms_games.gameId", "game_profile.gameId")
        .whereNull("game_profile.deletedAt")
        .where({"game_profile.userId": req.params.id})
        .groupBy('game_profile.platformId')
        .then(filters => res.json(filters))
        .catch(err => res.status(500).send(err))       
        
        
    }

    
    const remove = async (req,res) =>{
        
        try{
            console.log(req.params.id)

            await app.db('game_profile')
                .where({ id: req.params.id }).del()

            res.status(204).send()
        }catch(msg){
            res.status(400).send(msg)
        }       
        
    }
  
    return {save,get,remove}

}
