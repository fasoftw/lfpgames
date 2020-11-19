module.exports = app => {
    

    const get= (req,res) =>{
        app.db("filters")
        .select('filters.*','filters.name')
        .join("games", "games.id", "filters.gameId")
        .whereNull("games.deletedAt")
        .where({"filters.gameId": req.params.id})
        .then(filters => res.json(filters))
        .catch(err => res.status(500).send(err))  
        
    }   

    return {get}

}
