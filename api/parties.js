const queriesGames = require('./queries/queriesGames')

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
            existsOrError(party.isOpen,'Erro!')

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

            if(party.rank) existsOrError(verGameId.rank, 'Jogo não contem rank.')

            const verPlatformId = await app.db('platforms')
                .where({ id: party.platformId}).first()
            existsOrError(verPlatformId, 'Jogo não existe.')

        }catch(msg){
            console.log('error')
            return res.status(400).send(msg)
        }

        if(party.id) {
            console.log('update')
            party.updatedAt = new Date();
            app.db('party')
                .update({
                    updatedAt: party.updatedAt,
                    name: party.name,
                    gameId: party.gameId,
                    userId: party.userId,
                    platformId: party.platformId,
                    isOpen: party.isOpen,
                    numberPlayers: party.numberPlayers,
                    rank: party.rank,
                    description: party.description
                })
                .where({ id: party.id })
                .then(resposta => {
//                    app.db.raw(queriesGames.deleteFilters, resposta[0]).then( count => { console.log(count);})
                    const end = editFilters( resposta, party.filters)
                    res.send(end).status(204)
                }) 
                .catch(err => res.status(500).send(err)) 
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
                    spotsFilled: 0
                } )
                .then(resposta => {
                    // app.db.raw(queriesGames.addFirstPlayer, [
                    //     new Date(),  
                    //     party.userId,
                    //     resposta[0]])
                    // .then(

                    // )
                    party.filters.forEach((item) => {
                    app.db.raw(queriesGames.addFilters, [
                            new Date(),  
                        resposta[0],
                        item], item).then( count => {return count})
                     })
                    res.status(201).send(resposta) 
                }) 
                .catch(err => res.status(500).send(err)) 
        }

    
    }



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
   

    return {save, get}
}

