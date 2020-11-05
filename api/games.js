module.exports = app => {
    
    const { existsOrError, notExistsOrError }  = app.api.validation

    const save = async (req,res) => {
        const game = {...req.body}
        const id = req.params.id
        try{
            existsOrError(game.name, 'Nome não informado')
            existsOrError(game.imageUrl, 'Imagem não informada')
            existsOrError(game.description, 'Descrição não informada')
            existsOrError(game.categoryId, 'Categoria não informada.')
            existsOrError(game.maxPlayers, 'Número máximo de jogadores não informado')
            existsOrError(game.platforms, 'Plataforma não informada')
            
            const gameFromDB = await app.db('games')
                .where({ name: game.name })
                .whereNull('deletedAt')
                .first()  

            if(!id){ // se no existir id é edit
                 notExistsOrError(gameFromDB, 'Jogo já cadastrado')
            }   

        }catch(err){
            return res.status(400).send(err)
        }
        
        if(!id){
            game.createdAt = new Date();
            await app.db('games')
            .insert({categoryId: game.categoryId,name: game.name, createdAt: game.createdAt, 
                description: game.description,
                imageUrl: game.imageUrl, rank: game.rank , maxPlayers: game.maxPlayers, 
                levelMax: game.levelMax})
            .then(_resposta =>{ 
                res.status(201).send(_resposta)   
                addPlatform(_resposta ,game.platforms,res)  

            }).catch(err => res.status(500).send(err))
            
   
           
        } else{
            game.updatedAt = new Date();
            await app.db('games')
            .update({categoryId: game.categoryId,name: game.name, updatedAt: game.updatedAt, 
                description: game.description,
                imageUrl: game.imageUrl, rank: game.rank, 
                maxPlayers: game.maxPlayers, levelMax: game.levelMax})
            .where({id : id})
            .whereNull('deletedAt')
            .then(_ =>{
                 res.status(201).send()
                 editPlatform(id ,game.platforms)
                }
            )
            .catch(err => res.status(500).send(err))
        }

       
    
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

    const editPlatform = async( id, platforms) =>{

        await app.db('platforms_games')
        .delete()
        .where({gameId: id})
        .then(res => console.log(res))
        .catch( err => res.send(204).send(err))
 

        await platforms.forEach(item => {
            app.db('platforms_games')
            .insert({updatedAt: new Date(), gameId: id, platformId: item })
            .then(res => res.send(400).send())
            .catch(err => console.log(err)) 
        });
        
    }

    const getById = ( req, res ) => {
        app.db('games')
            .where({ id: req.params.id })
            .first()
            .then(game => {
                return res.json(game)    
            })
            .catch(err => res.status(500).send(err))
    }
   

    return {save,get, remove, getById}
}

