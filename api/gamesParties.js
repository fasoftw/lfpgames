module.exports = app => {
    
    const limit = 1
    const get = async(req,res)=>{

        const page = req.query.page || 1

        await app.db('party')
        .join("games","games.id", "party.gameId")
        .select('games.id as gameId', 'games.name as gameName', 'games.maxPlayers', 'party.*')
        .limit(limit).offset(page * limit - limit)
        .where({'party.isOpen': 1} && {'party.gameId': req.params.id})
        .then(parties => res.json({ parties, limit }))
        .catch(err => res.status(500).send(err))

        
    }

    const getPartyUsers = async(req,res)=>{
        await app.db('party_players')
        .select('*')
        .count(id)
        .where({'party_players': req.params.id})
        .then(users => res.json({ users, count }))
        .catch(err => res.status(500).send(err))
        
    }

    const addPlayer = async(req,res)=>{

    }

    return {get, getPartyUsers}

}
