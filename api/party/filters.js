module.exports = app => {
    

    const getById = async(req,res) =>{
        
        await app.db("party_filters")
        .select('party_filters.name',"party_filters.id")
        .join("party", "party_filters.partyId", "party.id")
        .join("games", "games.id", "party.gameId")
        .whereNull("games.deletedAt")
        .where({"party.gameId": req.params.id})
        .then(filters => {
            res.json(filters)})
        .catch(err => res.status(500).send(err))  
        
    }   

    return {getById}

}
