module.exports = {
    platformsGames:`
    select platformId as id from game_profile
    where gameId = ? and userId = ? and platformId = ? and deletedAt IS NULL`,

    searchProfile:`select id from game_profile
    where gameId = ? and userId = ? and platformId = ? and deletedAt IS NULL`,

    searchPlatform:`select platforms.id from platforms
    join platforms_games ON platforms_games.platformId = platforms.id
    where platforms_games.id = ? `
    
}