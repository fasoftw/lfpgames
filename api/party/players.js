const queries = require('./queries/queries')
module.exports = app => {
    
    const { existsOrError }  = app.api.validation

    const save = async (req,res) => {
        const party = {...req.body}
        const userId = party.playerId
        const partyId = req.params.id

        let profileFromDb, partyFromDb, profile
        try{
            existsOrError(userId, 'Error User Id')
            existsOrError(partyId, 'Error game Id')

            await app.db.raw(queries.searchParty, partyId)
            .then(res => partyFromDb = res[0])
        

            existsOrError(partyFromDb, 'Party not founded') 


            platformId = await app.db('platforms_games as pg')
                .join("platforms", "platforms.id", "pg.platformId")
                .select('platforms.id')
                .where({ "pg.id": party.platformId }).first()
            existsOrError(platformId, 'Platform does not exist') 


            profile = await app.db('game_profile as gp')
                .select('gp.id')
                .where({'gp.id':party.profiles}).first()
                .catch((err)=> console.log(err))
                console.log(profile)
               // existsOrError(profile, 'Empty profile') 




            await app.db.raw(queries.searchProfile, [userId, party.gameId, platformId.id])
            .then(res => profileFromDb = res[0])
            //existsOrError(profileFromDb, 'Empty profile') 

            
            

            //console.log('partyFromDb[0]') //idparty, spotsfilled, numMax
           // console.log(profileFromDb[0]) // idprofile

            var partyJson = Object.values(JSON.parse(JSON.stringify(partyFromDb)))
            var profileJson = Object.values(JSON.parse(JSON.stringify(profileFromDb))) 

        }catch(err){
            return res.status(400).send(err)
        }

         
        if(partyJson[0].numberPlayers >= partyJson[0].spotsFilled+1){
            app.db.transaction(async function(partyTr)
            {
                await app.db('party_players')
                .transacting(partyTr)
                .insert({userId: userId, partyId: partyId, gameProfileId: party.profiles})
                .then(_resposta =>{ 
                    if(partyJson[0].numberPlayers === partyJson[0].spotsFilled+1){
                        app.db('party')
                        .update({spotsFilled: partyJson[0].spotsFilled + 1, isOpen: 0})
                        .where({id: partyId})
                        .catch((err) => console.log(err))
                    }
                    else {
                        app.db('party')
                        .update({spotsFilled: partyJson[0].spotsFilled + 1})
                        .where({id: partyId})
                        .catch((err) => console.log(err))
                    }
                        
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
            .where({id: partyId})
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
            .whereNull('pp.deletedAt')
            .then( party =>{
                res.json({ party })
            })
            .catch(error => res.status(500).send(error))
    }

    const getByUserId = async (req,res)=>{

        app.db('party_players as pp')
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

    const remove = ( req, res) =>{  
        app.db.transaction(async function(PartyRemoveTr)   
        { 
            await app.db('party_players')
                .transacting(PartyRemoveTr)
                .update({deletedAt: new Date()})
                .where({partyId: req.params.partyId})
                .where({userId: req.params.userId})
                .then(_resposta =>{ 
                    app.db('party')
                        .decrement('spotsFilled', 1)
                        .update({isOpen: 1})
                        .where({id: req.params.partyId})
                        .catch((err) => console.log(err))

                        PartyRemoveTr.commit

                        res.status(201).send(_resposta.toString())
                    
                    }

                ) 
            .catch(err => {
                PartyRemoveTr.rollback
                console.log(err)
                res.status(500).send(err)
            })
        })
        .then(function() {
            console.log('Transaction complete.');
          })
          .catch(function(err) {
            console.error(err);
        });
    }

  

    return {save,getById,get,getByUserId, remove}
}

