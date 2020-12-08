const queries = require('./queries/queries')
module.exports = app => {
    
    const { existsOrError }  = app.api.validation

    const save = async (req,res) => {
        const party = {...req.body}
        const id = req.params.id
        let profileFromDb, partyFromDb

        try{

            existsOrError(id, 'Error Party Id')
            existsOrError(party.userId, 'Error User Id')
            existsOrError(party.platformId, 'Error platform Id')
            existsOrError(party.gameId, 'Error game Id')

            await app.db.raw(queries.searchParty, id)
            .then(res => partyFromDb= res[0])
        

            existsOrError(partyFromDb, 'Party not founded') 
            
            await app.db.raw(queries.searchProfile, [party.userId, party.gameId, party.platformId])
            .then(res => profileFromDb = res[0])
            
            if(profileFromDb.length === 0){
                return res.send("Empty profile")
            } 

            var partyJson = Object.values(JSON.parse(JSON.stringify(partyFromDb)))
            var profileJson = Object.values(JSON.parse(JSON.stringify(profileFromDb))) 

        }catch(err){
            return res.status(400).send(err)
        }
        
        if(partyJson[0].numberPlayers >= partyJson[0].spotsFilled+1){
            app.db.transaction( async function(partyTr)
            {
                await app.db('party_players')
                .transacting(partyTr)
                .insert({userId: party.userId, partyId: id, gameProfileId: profileJson[0].id})
                .then(_resposta =>{
                    
                    app.db('party')
                    .update({spotsFilled: partyJson[0].spotsFilled+1})
                    .where({id: id})
                    .catch((err) => console.log(err))

                    partyTr.commit
                    res.status(201).send(_resposta)
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

            await app.db('party')
            .update({isOpen: 0})
            .where({id: id})
            .catch((err) => console.log(err))

            return res.send("closed party")
        }
    
       
    
    }

    const getById = async (req,res)=>{

        app.db('party_players as pp')
            .join('users', 'users.id', 'pp.userId')
            .join('game_profile as gp', 'gp.id', 'pp.gameProfileId')
            .select('pp.id', 'pp.partyId', 'users.name as name', 'gp.name as nickname')
            .where({partyId: req.params.id})
            .then( party =>{
                res.json({ party })
            })
            .catch(error => res.status(500).send(error))
    }

    const get = async (req,res) => {
        
        await app.db('party_players')
        .select('*')
        .whereNull('deletedAt')
        .then(
            partyPlayers => res.json({ partyPlayers })
        )
        .catch(error => res.status(500).send(error))


    }

  

    return {save,getById,get}
}

