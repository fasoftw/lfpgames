module.exports = app => {
    
    const get = async(req,res)=>{

         app.db('party_filters')
        .select('*')
        .whereNull('deletedAt')
        .then(filters=> res.json(filters))
        .catch(err => res.status(500).send(err))
    }

    const getByIdParty = (req,res) =>{
        app.db("party_filters")
        .select('party_filters.*','party_filters.name')
        .join("party", "party.id", "party_filters.partyId")
        .whereNull("party_filters.deletedAt")
        .where({"party_filters.partyId": req.params.id})
        .then(filters => res.json(filters))
        .catch(err => res.status(500).send(err))
        
    }

    

    return {get,getByIdParty}

}
