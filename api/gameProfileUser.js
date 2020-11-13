module.exports = app => {
    

    const getByIdUser = (req,res) =>{
        app.db("game_profile")
        .count('platforms_games.id as numberPlatforms')
        .select('game_profile.*','games.name as gameName')
        .join("users", "users.id", "game_profile.userId")
        .join("games", "games.id", "game_profile.gameId")
        .join("platforms_games", "platforms_games.gameId", "game_profile.gameId")
        .whereNull("game_profile.deletedAt")
        .where({"game_profile.userId": req.params.id})
        .then(filters => res.json(filters))
        .catch(err => res.status(500).send(err))       
        
        
    }
    

    return {getByIdUser}

}
