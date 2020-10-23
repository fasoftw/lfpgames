module.exports = app => {
    
    const { existsOrError, notExistsOrError, equalsOrError, isNumber, isBoolean }  = app.api.validation

    const save = async (req,res) => {
        const game = {...req.body}
        try{

            existsOrError(game.name, 'Nome não informado')
            existsOrError(game.imageUrl, 'Imagem não informada')
            existsOrError(game.description, 'Descrição não informada')
            existsOrError(game.categoryId, 'Categoria não informada')
            existsOrError(game.maxPlayers, 'Número máximo de jogadores não informado')
            existsOrError(game.rank, 'Rank do jogo não informado')
            isNumber(game.maxPlayers, 'Tipo esperado é number')
            isBoolean(game.rank, "Tipo esperado é booleano")
 
        } catch(err){
            res.status(400).send(err)
        }

        game.createdAt = new Date();

       app.db('games')
        .insert(game)
        .then(_ => res.status(201).send())


    }

    const get = (req,res) =>{
        const teste = app.db('games')
        .select('*')
        .then(games => res.json(games))
        .catch(err => res.status(500).send(err))
    }
    return {save,get}
}

