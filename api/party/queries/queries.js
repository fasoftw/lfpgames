module.exports = {
    hasParty:`select games.id 
    from party
    join games ON party.gameId = games.id 
    where userId <> ?`,
    
    gameProfile: `select games.id 
    from game_profile
    join games ON game_profile.gameId = games.id 
    where game_profile.userId = ?`,

    gamesRecommendations: `select games.id, party.* 
    from party
    join games ON party.gameId = games.id
    where userId <> ?
    LIMIT 8`,

    searchProfile: `select id
    from game_profile where userId = ? and gameId = ? and platformId = ? 
    and deletedAt is null`,

    searchParty: `select id , spotsFilled, numberPlayers, name
    from party
    where id = ?`,

    searchFilters: `select name, id
    from party_filters where partyId = ? and deletedAt is null`,

    insertNotification: `insert into party_notifications (createdAt, nameParty, notificationId, userId)
    values (?, ?, ?, ?)`
}
