const queries = require('./queries/queries')

module.exports = app => {
    
    const { existsOrError }  = app.api.validation

    const save = async (req,res) => {
        const party = {...req.body}
        if(req.params.id) party.id = req.params.id
        try{
            existsOrError(party.name,'Nome da party não informado.')
            existsOrError(party.userId,'Usuario não informado.')
            existsOrError(party.gameId,'Jogo não informado.')
            existsOrError(party.platformId,'Plataforma não informado.')
            existsOrError(party.numberPlayers,'Numero de players não informado.')

/*            const verNameParty = await app.db('party')
                .where({ name: party.name }).first()
            existsOrError(verNameParty, 'O Nome do grupo já existe.')  */

            const verUserId = await app.db('users')
                .where({ id: party.userId })
                .whereNull('deletedAt')
                .first()

            existsOrError(verUserId, 'Usuário não existe.')


            const verGameId = await app.db('games')
                .where({ id: party.gameId }).first()
            existsOrError(verGameId, 'Jogo não existe.')

            if(party.rank) existsOrError(verGameId.rank, 'Error')

            const verPlatformId = await app.db('platforms_games as pg')
                .join("platforms", "platforms.id", "pg.platformId")
                .where({ "pg.id": party.platformId }).first()

            existsOrError(verPlatformId, 'Error platform.')


            const verGameProfile = await app.db('game_profile')
                .where({ userId: party.userId }) 
                .where({gameId: party.gameId} ) 
                .where({platformId: verPlatformId.platformId})

                
            existsOrError(verGameProfile, 'Error User does not have a Profile.')


        }catch(msg){
            return res.status(400).send(msg)
        }

        if(party.id) {
        app.db.transaction( async function(partyTr)
        {
            await app.db('party')
            .transacting(partyTr)
            .update({
                updatedAt: party.updatedAt = new Date(),
                name: party.name,
                gameId: party.gameId,
                userId: party.userId,
                platformId: party.platformId,
                isOpen: party.isOpen,
                numberPlayers: party.numberPlayers,
                rank: party.rank,
                description: party.description,
                spotsFilled: party.spotsFilled,
                isOpen: party.isOpen,
                level: party.level
            })
            .where({ id: party.id })
            .then(_resposta =>{
                
                
                app.db.raw(queries.deleteFilters, party.id).then( 
                count => { return count })

                party.filters.forEach((item) => {

                    app.db.raw(queries.addFilters, [new Date(),party.id,item]).
                        then( () => {
                            return 
                        })
                        .catch(err => console.log(err))
                })

                partyTr.commit
                res.sendStatus(201).send(_resposta) 
                
                
                
            })
            .catch(err => {
                partyTr.rollback
                res.status(500).send(err)
            })
         })
         .then(function() {
            console.log('Transaction complete.');
          })
          .catch(function(err) {
            console.error(err);
        });

        }else{
            party.createdAt = new Date();
            await app.db('party')
                .insert( { 
                    createdAt: party.createdAt,
                    name: party.name,
                    gameId: party.gameId,
                    userId: party.userId,
                    platformId: party.platformId,
                    isOpen: party.isOpen,
                    numberPlayers: party.numberPlayers,
                    rank: party.rank,
                    description: party.description,
                    spotsFilled: 0,
                    isOpen: party.isOpen,
                    level: party.level
                } )
                .then(resposta => {
                    party.filters.forEach((item) => {
                        app.db.raw(queries.addFilters, [
                                new Date(),  
                            resposta[0],
                            item], item).then( count => {return count})
                        }
                    )
                    res.status(201).send(resposta) 
                }) 
                .catch(err => res.status(500).send(err)) 
        }

    
    }


/*
    const limit = 10
    const get = async (req,res) =>{
        const page = req.query.page || 1

        const result = await app.db('party').count('id').first()

        const count = parseInt(result.count) 


        app.db('party')
            .select('*')
            .limit(limit).offset(page * limit - limit)
            .whereNull('deletedAt')
            .then(parties => res.json({ parties, count, limit }))
            .catch(err => res.status(500).send(err))
    } 
*/
    const remove = async (req,res) =>{
        const id = req.params.id
       

        app.db('party')
        .where({id: req.params.id})
        .del()
        .then( () =>
            res.status(200).send()
        )
        .catch(err => res.status(204).send(err))
    }
    
   

    return {save, /*get,*/ remove}
}

