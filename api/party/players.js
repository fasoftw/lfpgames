const queries = require('./queries/queries')
module.exports = app => {

  
    
    const { existsOrError }  = app.api.validation

    const save = async (req,res) => {

        const party = {...req.body}
        const userId = party.playerId
        const partyId = req.params.id

        let partyFromDb, profile
        try{
            existsOrError(userId, 'Error User Id')
            existsOrError(partyId, 'Error game Id')

            platformId = await app.db('platforms_games as pg')
                .join("platforms", "platforms.id", "pg.platformId")
                .select('platforms.id')
                .where({ "pg.id": party.platformId }).first()
            existsOrError(platformId, 'Platform does not exist') 


            profile = await app.db('game_profile as gp')
                .select('gp.id')
                .where({'gp.id':party.profiles}).first()
                .catch((err)=> console.log(err))             



            await app.db.raw(queries.searchProfile, [userId, party.gameId, platformId.id])
            .then(res => profileFromDb = res[0])

            await app.db.raw(queries.searchParty, partyId)
            .then(res => partyFromDb = res[0])
    
            var partyJson = Object.values(JSON.parse(JSON.stringify(partyFromDb)))


        }catch(err){
            return res.status(400).send(err)
        }
        
        let inTheParty = false
        await app.db('party_players as pp')
        .select('pp.id')
        .where({partyId: partyId})
        .where({'pp.userId': userId})
        .then( party =>{
            if(party.length >= 1){
               inTheParty = true
            }
        })
        .catch(error => {return error})

         
        if(partyJson[0].isOpen = 1 && partyJson[0].numberPlayers >= partyJson[0].spotsFilled+1 && !inTheParty){

        async function withTransaction(callback) {
            const plyr = await app.db.transaction();
                try {
                    let result = []
                    result = await app.db('party_players')
                    .insert({userId: userId, partyId: partyId, gameProfileId: party.profiles})
                    .then((res)=> {return res})
                    .catch(err => {return err})
                    if(result){
                        if(partyJson[0].numberPlayers === partyJson[0].spotsFilled+1){
                            await app.db('party')
                            .update({spotsFilled: partyJson[0].spotsFilled + 1, isOpen: 0})
                            .where({id: partyId})
                            .catch((err) => console.log(err))
                        }
                        else {
                            await app.db('party')
                            .update({spotsFilled: partyJson[0].spotsFilled + 1})
                            .where({id: partyId})
                            .catch((err) => console.log(err))
                        }

      

                       
                    }

                    result.players = []
                    const players = await app.db('party_players as pp')
                    .join('users', 'users.id', 'pp.userId')
                    .join('game_profile as gp', 'gp.id', 'pp.gameProfileId')
                    .select('pp.id', 'pp.partyId', 'users.name as name', 'gp.name as nickname')
                    .where({partyId: partyId})
                    .then( res =>{
      
                        return res
                    })
                    .catch(err => {return err})           

                    await plyr.commit();

                    res.status(201).send(players)
       
                   
                    return result;   
                        
                
           } catch (e) {
               await plyr.rollback();
               throw e;
           }
          }

          withTransaction()
          

        
    
    }else if(partyJson[0].numberPlayers < partyJson[0].spotsFilled+1 || partyJson[0].isOpen === 0){

            await app.db('party')
            .update({isOpen: 0})
            .where({id: partyId})
            .catch((err) => console.log(err))

            return res.send("closed party")
        }
    }

    const getById = async (req,res)=>{
        await app.db('party_players as pp')
            .join('users', 'users.id', 'pp.userId')
            .join('game_profile as gp', 'gp.id', 'pp.gameProfileId')
            .select('pp.id', 'pp.partyId', 'users.name as name', 'gp.name as nickname')
            .where({partyId: req.params.id})
            .whereNull('pp.deletedAt')
            .then( party =>{
                res.json({ party })
            })
            .catch(error => res.status(500).send(error))
    }

    const getByUserId = async (req,res)=>{

        await app.db('party_players as pp')
            .select('pp.id')
            .where({partyId: req.params.partyId})
            .where({'pp.userId': req.params.userId})
            .whereNull('deletedAt')
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

    const remove = async ( req, res) =>{  
        async function withTransaction(callback) {
            const trx = await app.db.transaction();
            try {
                const result = await app.db('party_players')
                .where({partyId: req.params.partyId})
                .where({userId: req.params.userId})
                .del()
                .catch(err => console.log(err))
                    if(result){
                         await app.db('party')
                        .decrement('spotsFilled', 1)
                        .update({isOpen: 1})
                        .where({id: req.params.partyId})
                        .catch((err) => console.log(err)) 
                    }
                    res.sendStatus(201)
                    
                    trx.commit

                }catch(err) {
                    trx.rollback
                    console.log(err)
                    res.status(500).send(err)
                }
            }

            withTransaction()
    }

  

    return {save,getById,get,getByUserId, remove}
}

