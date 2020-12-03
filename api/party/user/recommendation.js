const queries = require('../queries/queries')

module.exports = app => {
    


    const get = async(req,res)=>{
   
        const games = await app.db.raw(queries.hasParty, req.params.id)
        .then( res => { return res[0] })

        if(games.length > 0){
            const arrayGames = games.map( game =>{
                return game.id
            })
            
            let parties = await getGames(arrayGames)
            res.json({ parties })

        } else{
            const gamesProfile = await app.db.raw(queries.gameProfile, req.params.id)
            .then( res => { return res[0] }).catch(err => console.log(err))
            

            if(gamesProfile.length > 0){
               
                const arrayGamesProfile = gamesProfile.map( game =>{
                    return game.id
                })
               
                parties = await getGames(arrayGamesProfile)
                res.json({ parties })
    
              
            } else{

                await app.db.raw(queries.gamesRecommendations)
                .then( resp => { res.json(resp[0])})
                .catch(err => console.log(err))
                

            }
        }


           

        
    }

    const getGames =  async (array)=>{

        return await app.db.raw(`select games.name, party.*, users.name as userName
            from party
            join games ON games.id = party.gameId
            join users ON users.id = party.userId
            WHERE games.id IN (${array})
            group by games.id
            LIMIT 8
        `)
        .then( res=> { return res[0] })
    }

    return {get}

}
