module.exports = app => {
    
    const { existsOrError}  = app.api.validation

    const save = async (req,res) => {
        const filter = {...req.body}

        try{

            existsOrError(filter.name, 'Nome do filtro não informado')
            existsOrError(filter.gameId, 'Nome do game não informado')                   
    

        }catch(err){
            return res.status(400).send(err)
        }

        if(!req.params.id){
            filter.createdAt = new Date();
            app.db('filters')
            .insert(filter)
            .then(_ => res.status(201).send())
            .catch(err => res.status(500).send(err))
        } else{
            filter.updatedAt = new Date();
            app.db('filters')
            .update(filter)
            .where({id: req.params.id})
            .then(_ => res.status(201).send())
            .catch(err => res.status(500).send(err))

        }


    }

    const get = async(req,res)=>{

         app.db('filters')
        .select('*')
        .whereNull('deletedAt')
        .then(filters=> res.json(filters))
        .catch(err => res.status(500).send(err))
    }

    

    return {save,get}

}
