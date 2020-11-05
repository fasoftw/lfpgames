module.exports = app => {
    
    const { existsOrError, notExistsOrError }  = app.api.validation

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

            if(party.rank) existsOrError(verGameId.rank, 'Jogo não contem rank.')

            const verPlatformId = await app.db('platforms')
                .where({ id: party.platformId}).first()
            existsOrError(verPlatformId, 'Jogo não existe.')

        }catch(msg){
            return res.status(400).send(msg)
        }

        if(party.id) {
            party.updatedAt = new Date();
            app.db('party')
                .update(party)
                .where({ id: party.id })
                .then(() => res.status(204).send()) 
                .catch(err => res.status(500).send(err)) 
        }else{
            party.createdAt = new Date();
            app.db('party')
                .insert( party )
                .then(() => res.status(204).send()) 
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
            .then(party => res.json({data: party, count, limit}))
            .catch(err => res.status(500).send(err))
    }

    
   

    return {save, get}
}

