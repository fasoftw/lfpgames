module.exports = app => {
    
    const { existsOrError, notExistsOrError, isNumber, isBoolean, existsOrErrorPlatform }  = app.api.validation

    const save = async (req,res) => {
        const game = {...req.body}
        const id = req.params.id
        try{
            existsOrError(game.name, 'Nome não informado')
            existsOrError(game.imageUrl, 'Imagem não informada')
            existsOrError(game.description, 'Descrição não informada')
            existsOrError(game.categoryId, 'Categoria não informada.')
            existsOrError(game.maxPlayers, 'Número máximo de jogadores não informado')
 //           isNumber(game.maxPlayers, 'Tipo esperado é number')
 //           isBoolean(game.rank, "Tipo esperado é booleano")
            existsOrError(game.platforms, 'Plataforma não informada')
            
            const gameFromDB = await app.db('games')
                .where({ name: game.name })
                .whereNull('deletedAt')
                .first()  
            if(!id){ // se no existir id é edit
                 notExistsOrError(gameFromDB, 'Jogo já cadastrado')
            }   
            
            const platformsFromGame = await app.db('platforms_games')
                .where({ gameId: req.params.id })
            
            const verifyPlatforms = await game.platforms.forEach(gamePlatform => {
                platformsFromGame.forEach( platformDB => {
                    const equal = platformDB.platformId === gamePlatform ? `plataforma ${gamePlatform} já cadastrada` : false  
                    
                })
            })
                   
                
            notExistsOrError(platformsFromGame, 'Jogo já tem essa plataforma.')


        }catch(err){
            return res.status(400).send(err)
        }
        let idGame;
        
        if(!id){
            game.createdAt = new Date();
            
            await app.db('games')
            .insert({categoryId: game.categoryId,name: game.name, createdAt: game.createdAt, description: game.description,
                imageUrl: game.imageUrl, rank: game.rank , maxPlayers: game.maxPlayers, levelMax: game.levelMax})
            .then(_resposta =>{ 
                res.status(201).send(_resposta) 
                idGame = _resposta      
            }).catch(err => res.status(500).send(err))
            
   
           
        } else{
            game.updatedAt = new Date();
            await app.db('games')
            .update({categoryId: game.categoryId,name: game.name, updatedAt: game.updatedAt, description: game.description,
                imageUrl: game.imageUrl, rank: game.rank , maxPlayers: game.maxPlayers, levelMax: game.levelMax})
            .where({id : id})
            .whereNull('deletedAt')
            .then(_ =>{
                 res.status(201).send()
                 idGame = id
                }
            )
            .catch(err => res.status(500).send(err))
        }

        addPlatform(idGame,game.platforms,res)
    
    }

    const get = (req,res) =>{
         app.db('games')
        .select('*')
        .whereNull('deletedAt')
        .then(games => res.json(games))
        .catch(err => res.status(500).send(err))
    }

    const remove = async ( req, res) =>{        

        try{
            existsOrError(req.params.id, 'Código do game não informado.')

             await app.db('filters')
            .update({deletedAt: new Date()})
            .where({ gameId: req.params.id })


            const platformsUpdated = await app.db('platforms_games')
            .update({deletedAt: new Date()})
            .where({ gameId: req.params.id })
            existsOrError(platformsUpdated, 'Plataforma não foi encontrada.')

           
            const rowsUpdated = await app.db('games')
            .update({deletedAt: new Date()})
            .where({ id: req.params.id })
            existsOrError(rowsUpdated, 'Game não foi encontrado.')

             res.status(204).send()

            } catch(err){

                return res.status(400).send(err)

            }
    }

    const addPlatform = async( id, platforms) =>{
        await platforms.forEach(item => {
            app.db('platforms_games')
            .insert({createdAt: new Date(),gameId: id, platformId: item })
            .then(_ => console.log('cadastrado'))
            .catch(err => console.log(err)) 
        });
        
    }
   

    return {save,get, remove}
}

