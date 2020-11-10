module.exports = app => {
    
    const get = (req,res) =>{
        app.db('platforms')
        .whereNull('deletedAt')
        .orderBy('name')
        .then(platforms => res.json(platforms))
        .catch(err => res.status(500).send(err))
    }

    const getByIdGame = (req,res) =>{
        app.db("platforms_games")
        .select('platforms_games.*','platforms.name')
        .join("platforms", "platforms.id", "platforms_games.platformId")
        .whereNull("platforms_games.deletedAt")
        .where({"platforms_games.gameId": req.params.id})
        .groupBy('platforms_games.platformId')
        .then(platforms => res.json(platforms))
        .catch(err => res.status(500).send(err))
        
    }

    return {get,getByIdGame}
}
