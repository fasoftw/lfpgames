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
    

        const platforms = await app.db.raw(queries.platformsGames,[profile.gameId, profile.userId,
            profile.platformId]) 

        let getPlatform = {}

        await app.db.raw(queries.searchPlatform, profile.platformId)
        .then(res => getPlatform = Object.values(JSON.parse(JSON.stringify(res[0]))))


        if(!req.params.id && (platforms[0].length == 0)){

            profile.createdAt = new Date();
            await app.db('game_profile')
            .insert({createdAt: new Date(), name: profile.name, gameId: profile.gameId, 
                userId: profile.userId, platformId: getPlatform[0].id })
            .then(_resposta => {
                res.status(201).send(_resposta.toString())})
            .catch(err => res.status(500).send(err))

        } else if(!req.params.id && (platforms[0].length >= 1)){

            profile.updatedAt = new Date();

            const profileId = await app.db.raw(queries.searchProfile,[profile.gameId, profile.userId,
                getPlatform[0].id])
 
            var profileJson = Object.values(JSON.parse(JSON.stringify(profileId[0])))


            await app.db('game_profile')
            .update({updatedAt: new Date(), name: profile.name, gameId: profile.gameId, 
                userId: profile.userId, platformId: getPlatform[0].id })
            .where({id: profileJson[0].id})
            .then(_resposta => 
                {
                    res.status(201).send(profileJson[0].id.toString())
            
            })
            .catch(err => res.status(500).send(err))

        } else if(req.params.id ){

            profile.updatedAt = new Date();
            await app.db('game_profile')
            .update({updatedAt: new Date(), name: profile.name, gameId: profile.gameId, 
                userId: profile.userId, platformId: getPlatform[0].id })
            .where({id: req.params.id})
            .then(_resposta => res.status(201).send(_resposta.toString()))
            .catch(err => res.status(500).send(err))
        }


    }
    
    const get = async (req,res) =>{
        await app.db("game_profile")
        .select('game_profile.*','games.name as gameName', 'platforms.name as platformName')
        .join("users", "users.id", "game_profile.userId")
        .join("games", "games.id", "game_profile.gameId")
        .join("platforms", "platforms.id", "game_profile.platformId")
        .join("platforms_games", "platforms_games.gameId", "game_profile.gameId")
        .where({"game_profile.userId": req.params.id})
        .groupBy('game_profile.name')
        .then(filters => {
            res.json(filters)})
        .catch(err => res.status(500).send(err))       
    }

    const getById = async (req,res) =>{
        const userId = req.params.userId
        const gameId =req.params.gameId
        const platformId = req.params.platformId
        
        await app.db("game_profile as gp")
        .join("platforms", "platforms.id", "gp.platformId")
        .join("platforms_games as pg", "pg.platformId", "platforms.id")
        .select('gp.id', 'gp.name')
        .whereNull("gp.deletedAt")
        .where({"gp.userId": userId})
        .where({"gp.gameId": gameId})
        .where({"pg.Id": platformId})
        .then(profiles => res.json(profiles))
        .catch(err => res.status(500).send(err))       
    }



    
    const remove = async (req,res) =>{
        
        try{

            await app.db('game_profile')
                .where({ id: req.params.id }).del()

            res.status(204).send()
        }catch(msg){
            res.status(400).send(msg)
        }       
        
    }
  
    return {save,get,getById,remove}

}
