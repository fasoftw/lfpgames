module.exports = app => {
    


    const get = async(req,res)=>{
        

        await app.db('party_players')
        .join("users","users.id", "party.gameId")
        .select('games.id as gameId', 'games.name as gameName', 'games.maxPlayers', 'party.*')
        .where({'party.isOpen': 1} && {'party.gameId': req.params.id})
        .then(parties => res.json({ parties, limit }))
        .catch(err => res.status(500).send(err))

        
    }

    return {get}

}
