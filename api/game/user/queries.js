module.exports = {
    platformsGames:`
    select platformId as id from game_profile
    where gameId = ? and userId = ? and platformId = ? and deletedAt IS NULL`,

    searchProfile:`select id from game_profile
    where gameId = ? and userId = ? and platformId = ? and deletedAt IS NULL`,

    searchPlatform:`select platforms.id from platforms
    join platforms_games ON platforms_games.platformId = platforms.id
    where platforms_games.id = ? `,

    searchGames:`SELECT count(g.id), g.name, sum(party.numberPlayers - party.spotsFilled) as spots,
        g.categoryId as category, g.id as id, 
        g.imageUrl as imageUrl, g.description
    FROM games as g
    LEFT join party ON party.gameId = g.id
    GROUP BY(g.id)
    UNION
    SELECT count(g.id), g.name, sum(party.numberPlayers - party.spotsFilled) as spots,
        g.categoryId as category, g.id as id, 
        g.imageUrl as imageUrl, g.description 
    FROM games as g
    RIGHT join party ON party.gameId = g.id
    GROUP BY(g.id)
    `
    
}