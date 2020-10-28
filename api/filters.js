module.exports = app => {
    
    const { existsOrError, notExistsOrError, equalsOrError, isNumber, isBoolean }  = app.api.validation

    const save = async (req,res) => {
        const filter = {...req.body}


        try{

            existsOrError(filter.categoryId, 'Categoria não informada')
            existsOrError(filter.name, 'Nome do filtro não informado')
            existsOrError(filter.gameId, 'Nome do game não informado')
           
            const categoryFromDB = await app.db('categories')
            .where({ id: filter.categoryId }).first()
            .catch(err =>
                res.status(400).send(err)
            )

            existsOrError(categoryFromDB, 'Categoria não existe')
    

            console.log(filter)
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
