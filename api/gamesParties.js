module.exports = app => {
    
    const get = async(req,res)=>{

         app.db('party')
         .count('party.id as counter')
        .select('games.name', 'games.description', 'games.*')
        .join("games","games.id", "party.gameId")
        .where("party.isOpen", 1)
        .groupBy('gameId')
        .limit(8)
        .then(filters=> res.json(filters))
        .catch(err => res.status(500).send(err))

        
    }

    return {get}

}
