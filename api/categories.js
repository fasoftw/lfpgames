module.exports = app => {
    
    const { existsOrError, notExistsOrError, equalsOrError, isNumber, isBoolean }  = app.api.validation

    const save = async (req,res) => {
        const category = {...req.body}
        try{

            existsOrError(category.name, 'Nome não informado')

            const categoryFromDB = await app.db('categories')
            .where({ name: category.name }).first()

    
            notExistsOrError(categoryFromDB, 'Categoria já cadastrada')

 
        } catch(err){
            res.status(400).send(err)
        }

       category.createdAt = new Date();
       app.db('categories')
        .insert(category)
        .then(_ => res.status(201).send())

    }

    const get = async(req, res) =>{
        app.db('categories')
        .select('*')
        .whereNull('deletedAt')
        .then(categories => res.json(categories))
        .catch(err => res.status(500).send(err))
    }

    const remove = async ( req, res) =>{        

        try{
            existsOrError(req.params.id, 'Código do game não informado.')


           
            const rowsUpdated = await app.db('categories')
            .update({deletedAt: new Date()})
            .where({ id: req.params.id })
            existsOrError(rowsUpdated, 'Categoria não foi encontrado.')

             res.status(204).send()

            } catch(err){

                return res.status(400).send(err)

            }
    }
    
    return {save,get,remove}
}

