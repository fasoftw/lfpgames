module.exports = app => {
    
    const limit = 1
    const get = async(req,res)=>{

        const page = req.query.page || 1


        await app.db('party')
        .join("games","games.id", "party.gameId")
        .join("users", "users.id", "party.userId")
        .select('games.id as gameId', 'games.name as gameName', 'games.maxPlayers', 'party.*', 'users.name as userName')
        .limit(limit).offset(page * limit - limit)
        .where({'party.isOpen': 1} && {'party.gameId': req.params.id})
        .then(parties =>{ console.log(parties) 
            res.json({ parties, limit })})
        .catch(err => res.status(500).send(err))

        
    }

    return {get}

}
