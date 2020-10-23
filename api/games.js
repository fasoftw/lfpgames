module.exports = app => {
    
    const { existsOrError, notExistsOrError, equalsOrError, isNumber, isBoolean }  = app.api.validation

    const save = async (req,res) => {

        const game = {...req.body}

        const categoryFromDB = await app.db('categories')
        .where({ id: game.categoryId }).first()

        try{

            existsOrError(game.name, 'Nome não informado')
            existsOrError(game.imageUrl, 'Imagem não informada')
            existsOrError(game.description, 'Descrição não informada')
            existsOrError(game.categoryId, 'Categoria não informada')
            existsOrError(game.maxPlayers, 'Número máximo de jogadores não informado')
            existsOrError(game.rank, 'Rank do jogo não informado')
            isNumber(game.maxPlayers, 'Tipo esperado é number')
            isBoolean(game.rank, "Tipo esperado é booleano")

            const gameFromDB = await app.db('games')
            .where({ name: game.name }).first()

         
    
            notExistsOrError(gameFromDB, 'Jogo já cadastrado')
            existsOrError(categoryFromDB, 'Categoria não existe')
 
        } catch(err){
            res.status(400).send(err)
        }

        game.createdAt = new Date();
     

        if(categoryFromDB){
            app.db('games')
            .insert(game)
            .then(_ => res.status(201).send())
            .catch(err => res.status(500).send(err))
        }

    }

    const get = (req,res) =>{
        const teste = app.db('games')
        .select('*')
        .then(games => res.json(games))
        .catch(err => res.status(500).send(err))
    }
    return {save,get}
}

