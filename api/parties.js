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

            await app.db('platforms_games as pg')
                .select("platformId")
                .where({ "pg.id": party.platformId }).first()
                .then(res=> verPlatform = res)

            if(party.profiles === undefined && party.nickname !== null){

                await app.db.raw(queries.addProfile, [new Date(), party.userId, verPlatform.platformId, party.gameId, party.nickname])
                .then(() => {return})
                .catch(err => console.log(err))
            } else if(party.profiles.length >0){
                app.db('game_profile')
                .update({name: party.profiles, updatedAt: new Date()})
                .where({platformId: verPlatform.platformId, userId: party.userId, gameId: party.gameId})
                .catch(err => console.log(err))
            }


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
            async function withTransaction(callback) {
                const trx = await app.db.transaction();
                try {
                 const result = await app.db('party')
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
                                   spotsFilled: 1,
                                   isOpen: party.isOpen,
                                   level: party.level
                              })
                                
                 await trx.commit(); 
                 if(result){

                    party.filters.forEach((item) => {
                        app.db.raw(queries.addFilters, [
                                new Date(),  
                            result[0],
                            item], item).then( count => {return count})
                        }
                    )

                    app.db.raw(queries.insertNotification, [new Date(), party.name, 1, party.userId])
                    .then(() => {return })
                    .catch(err => {console.log(err)})
                        

                    await app.db.raw(queries.searchProfile, [party.gameId, party.userId, verPlatform.platformId])
                    .then(res => profile = res[0])
                    
                    
                    const profileJson = profile.map( item=>{
                        return {id: item.id}
                    })

                    const plyr = await app.db.transaction();
                    try {
                        const resposta = await app.db('party_players')
                        .insert(
                               {userId: party.userId, 
                                partyId: result, 
                                gameProfileId: profileJson[0].id})
                        await plyr.commit();
                        res.status(201).send(resposta) 
                            
                            
                    }
                    catch(e){
                      await trx.rollback();
                        throw e;
                    }


                 }
                  
                 return result;
                } catch (e) {
                    await trx.rollback();
                    throw e;
                }
               }

              
               withTransaction()
              
               

 
        }
    }



    const getById = async (req,res) =>{
        await app.db('party')
            .select('*')
            .where({id: req.params.id})
            .whereNull('deletedAt')
            .then(party => {
                res.json({ party })
            })
            .catch(err => res.status(500).send(err))
    } 

    const remove = async (req,res) =>{       

        await app.db('party')
        .where({id: req.params.id})
        .del()
        .then( () =>
            res.status(200).send()
        )
        .catch(err => res.status(204).send(err))
    }
    
   

    return {save, getById, remove}
}

