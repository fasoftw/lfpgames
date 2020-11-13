module.exports = app => {
    

    const getByIdUser = (req,res) =>{
        app.db("game_profile")
        .select('game_profile.*','games.name as gameName', 'platforms.name as platformName')
        .join("users", "users.id", "game_profile.userId")
        .join("games", "games.id", "game_profile.gameId")
        .join("platforms", "platforms.id", "game_profile.platformId")
        .join("platforms_games", "platforms_games.gameId", "game_profile.gameId")
        .whereNull("game_profile.deletedAt")
        .where({"game_profile.userId": req.params.id})
        .groupBy('game_profile.platformId')
        .then(filters => res.json(filters))
        .catch(err => res.status(500).send(err))       
        
        
    }

    
    const remove = async (req,res) =>{
        
        try{
            console.log(req.params.id)

            await app.db('game_profile')
                .where({ id: req.params.id }).del()

            res.status(204).send()
        }catch(msg){
            res.status(400).send(msg)
        }       
        
    }
    

    return {getByIdUser, remove}

}
