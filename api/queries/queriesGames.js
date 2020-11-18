module.exports = {
    addFilters:`insert into party_filters (createdAt, partyId, name) values ( ?, ?, ?)`,

    deleteFilters:`delete * from party_filters where partyId = ?`,

    addFirstPlayer: `insert into party_players (createdAt, userId, partyId) values (?, ?, ?)`
}
