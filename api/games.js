module.exports = app => {
    
    const { existsOrError, notExistsOrError, isNumber, isBoolean }  = app.api.validation

    const save = async (req,res) => {
        const game = {...req.body}
        const id = req.params.id
        try{
            existsOrError(game.name, 'Nome não informado')
            existsOrError(game.imageUrl, 'Imagem não informada')
            existsOrError(game.description, 'Descrição não informada')
            existsOrError(game.categoryId, 'Categoria não informada.')
            existsOrError(game.maxPlayers, 'Número máximo de jogadores não informado')
            isNumber(game.maxPlayers, 'Tipo esperado é number')
            isBoolean(game.rank, "Tipo esperado é booleano")
            
            const gameFromDB = await app.db('games')
                .where({ name: game.name })
                .whereNull('deletedAt')
                .first()
            if(!id){ // se no existir id é edit
                 notExistsOrError(gameFromDB, 'Jogo já cadastrado')
            }         
        }catch(err){
            return res.status(400).send(err)
        }

        if(!id){
            game.createdAt = new Date();
            app.db('games')
            .insert(game)
            .then(_ => res.status(201).send())
            .catch(err => res.status(500).send(err))
        } else{
            game.updatedAt = new Date();
            app.db('games')
            .update(game)
            .where({id : id})
            .whereNull('deletedAt')
            .then(_ => res.status(201).send())
            .catch(err => res.status(500).send(err))
        }
    
    }

    const get = (req,res) =>{
         app.db('games')
        .select('*')
        .whereNull('deletedAt')
        .then(games => res.json(games))
        .catch(err => res.status(500).send(err))
    }

    const remove = async (req,res) =>{        

        try{
            existsOrError(req.params.id, 'Código do game não informado.')

            const filtersUpdated = await app.db('filters')
            .update({deletedAt: new Date()})
            .where({ gameId: req.params.id })
            existsOrError(filtersUpdated, 'Filtro não foi encontrado.')
            .catch(err =>
                res.status(400).send(err)
            )

            const rowsUpdated = await app.db('games')
            .update({deletedAt: new Date()})
            .where({ id: req.params.id })
            existsOrError(rowsUpdated, 'Game não foi encontrado.')
            .catch(err =>
                res.status(400).send(err)
            )

            res.status(204).send()
            } catch(err){

                res.status(400).send(err)

            }
    }
   

    return {save,get, remove}
}

