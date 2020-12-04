module.exports = {
    addFilters:`insert into party_filters (createdAt, partyId, name) values ( ?, ?, ?)`,

    deleteFilters:`delete from party_filters where partyId = ?`,

    addFirstPlayer: `insert into party_players (createdAt, userId, partyId) values (?, ?, ?)`,

    partyHasFilters: `select id from party_filters where partyId = ?`,

    partyHasPlayers: `select id from party_players where partyId = ?`,

    deleteParty: `delete from party where id = ?`,

    deletePlayers: `delete from party_players where id = ?`,

    deleteFiltersParty: `delete from party_filters where partyId = ?`
}
