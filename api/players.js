module.exports = app => {
    

    const getById = async (req,res)=>{
        const partyId = req.params.partyId
        const userId = req.params.userId
        const gameId = req.params.gameId
        const platformId = req.params.platformId



        let partyS ={}
        let statusIn = null
        let partyPlayerId = null
        let players = null
        let profiles = null

        await app.db('party')
        .select('*')
        .where({id: partyId})
        .then((party) => {
            partyS.party= party
            partyS.profiles = []
            partyS.players = []
            partyS.statusIn = null
            partyS.partyPlayerId = null
        })
        .catch(err => {return err})

        await app.db('party_players as pp')
        .select('pp.id')
        .where({partyId: partyId},{'pp.userId': userId})
        .then( party =>{
            if(party.length >= 1){
                statusIn = true
                partyPlayerId = party[0].id
            } else {
                statusIn = false
                partyPlayerId = null
            }
        })
        .catch(error => {return error})

    
        await app.db("game_profile as gp")
        .join("platforms", "platforms.id", "gp.platformId")
        .join("platforms_games as pg", "pg.platformId", "platforms.id")
        .select('gp.id', 'gp.name')
        .whereNull("gp.deletedAt")
        .where({"gp.userId": userId})
        .where({"gp.gameId": gameId})
        .where({"pg.Id": platformId})
        .then((prof) => profiles = prof)
        .catch(err => {return err})  

        partyS.profiles = profiles
        partyS.statusIn = statusIn
        partyS.partyPlayerId = partyPlayerId


        res.status(201).send(partyS)
    }
   
    return {getById}

}
