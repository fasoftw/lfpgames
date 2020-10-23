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
        const cat = app.db('categories')
        .select('*')
        .then(categories => res.json(categories))
        .catch(err => res.status(500).send(err))
    }
    return {save,get}
}

