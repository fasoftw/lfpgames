module.exports = app => {
    
    const limit = 10
    const get = async(req,res)=>{
        const page = req.query.page || 1

        app.db('party as p')
        .leftJoin('party_filters as pf', 'pf.partyId', 'p.id')
        .join('games as g', 'g.id', 'p.gameId')
        .join('users', 'users.id', 'p.userId')
        .join('platforms_games as pg', 'pg.id', 'p.platformId')
        .join("platforms", "platforms.id", "pg.platformId")
        .select('p.*', 'pf.id as filterId', 'pf.name as name','users.name as userName', 'p.name as partyName', 'g.maxPlayers as maxPlayers', 'g.rank as gameRank', 'platforms.name as platformName')
        .limit(limit).offset(page * limit - limit)
        //.where({isOpen: 1})
        .where({'p.gameId' : req.params.id})
        .whereNull('p.deletedAt')
        .then(parties => {
            //console.log(parties)
            parties = parties.map((p, i, array) => partyWithFilters(p, array));
            parties = withoutDuplicate(parties);

            return res.json({parties, limit })
        })
        .catch(e => console.log(e));

        const partyWithFilters = (p, parties) => {
            const party = { ...p };
            party.filters = [];
            parties.map((v) => {
                if(v.id == party.id) {
                    party.filters.push({ id: v.nameId, name: v.name });
                }
            });
            delete party.filterId;
            delete party.name;
            return party;
        }  
    
        const withoutDuplicate = withDuplicate => {
            const ids = [];
            const $arr = [];

            withDuplicate.forEach(p => {
                if(!ids.includes(p.id)) {
                    $arr.push(p);
                    ids.push(p.id);
                }
            })
            return $arr;
        }

        
    }

    return {get}

}
