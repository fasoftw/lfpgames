module.exports = {
    addFilters:`insert into party_filters (createdAt, partyId, name) values ( ?, ?, ?)`,

    deleteFilters:`delete from party_filters where partyId = ?`,

    addFirstPlayer: `insert into party_players (createdAt, userId, partyId) values (?, ?, ?)`,

    partyHasFilters: `select id from party_filters where partyId = ?`,

    partyHasPlayers: `select id from party_players where partyId = ?`,

    deleteParty: `delete from party where id = ?`,

    deletePlayers: `delete from party_players where id = ?`,

    deleteFiltersParty: `delete from party_filters where partyId = ?`,

    searchParty: `select id , spotsFilled, numberPlayers
    from party
    where id = ? and isOpen = 1 and deletedAt is null`,

    insertNotification: `insert into party_notifications (createdAt, nameParty, notificationId, userId)
    values (?, ?, ?, ?)`,

    searchProfile:`select game_profile.id as id, game_profile.name as name 
    from game_profile
    join platforms ON platforms.id = game_profile.platformId
    join platforms_games ON platforms_games.platformId = platforms.id
    where game_profile.gameId = ? and game_profile.userId = ? and game_profile.platformId = ?`,

    addProfile: `insert into game_profile (createdAt, userId, platFormId, gameId, name)
    VALUES (?, ?, ?,?,?)`
}
