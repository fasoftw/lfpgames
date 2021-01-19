
const queries = require('./user/queries')


module.exports = app => {
    const { existsOrError }  = app.api.validation
    const limit = 20
    const getById = async(req,res)=>{
        const page = req.query.page || 1
        async function withTransaction(callback) {
            const trx = await app.db.transaction();
            let result = []
            try{

            
            result = await app.db('party as p')
            .leftJoin('party_filters as pf', 'pf.partyId', 'p.id')
            .join('games as g', 'g.id', 'p.gameId')
            .join('users', 'users.id', 'p.userId')
            .join('platforms_games as pg', 'pg.id', 'p.platformId')
            .join("platforms", "platforms.id", "pg.platformId")
            .select('p.*', 'pf.id as filterId', 'pf.name as name','users.name as userName', 'p.name as partyName', 'g.maxPlayers as maxPlayers', 'g.rank as gameRank', 'platforms.name as platformName')
            .limit(limit).offset(page * limit - limit)
            //.where({isOpen: 1})
            .where({'p.gameId' : req.params.id})
            //.whereNull('p.deletedAt')
      
        
                    const partiesFilters = result.map((p, i, array) => partyWithFilters(p, array));

                    const parties = withoutDuplicate(partiesFilters);

                    res.json({parties, limit })
                
                await trx.commit()
                
            
            }catch (e) {
            await trx.rollback();
            throw e;
            }

          



   
   }
   withTransaction()
}

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

        const get = async (req,res)=>{
            await app.db.raw(queries.searchGames)
            .then( (resp) => {
                res.json(resp[0])
            })
            .catch(err => {return err})
        }

        const save = async(req,res) =>{
            const party = {...req.body}


            try{

    
                existsOrError(party.id, 'Error data ')

            }catch(err){
               return res.status(400).send(err)
            }

            if(party.ready === 0){

                await app.db('party')
                .update({ready: 1,updatedAt: new Date()})
                .where({id: party.id})
                .then( () =>{
                    res.status(201).send() 
                }).catch(err =>{
                    res.status(500).send() 
                })
            } else if(party.ready === 1){
                await app.db('party')
                .update({deletedAt: new Date()})
                .where({id: party.id})
                .then( () =>{
                    res.status(201).send() 
                }).catch(err =>{
                    res.status(500).send() 
                })
            }

        }

        
    
    return {getById,get,save}
}
