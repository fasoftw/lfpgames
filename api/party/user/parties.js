module.exports = app => {
    


    const get = (req, res) => {
       			
            app.db('party as p')
            .leftJoin('party_filters as pf', 'pf.partyId', 'p.id')
            .join('users', 'users.id', 'p.userId')
            .join('games as g', 'g.id', 'p.gameId')
            .select('p.*', 'pf.id as filterId', 'pf.name as name','users.name as userName', 'p.name as partyName', 'g.maxPlayers as maxPlayers', 'g.rank as gameRank')
            .where({userId: req.params.id})                
            .then(parties => {
                parties = parties.map((p, i, array) => partyWithFilters(p, array));
                parties = withoutDuplicate(parties);

                return res.json(parties);  
            })
            .catch(e => res.status(500).json(e));

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
