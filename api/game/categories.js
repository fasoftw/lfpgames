module.exports = app => {
    

    const get = async (req,res) =>{
        await app.db("categories as c")
        .select('c.name', 'c.id')
        .join("games", "games.categoryId", "c.id")
        .groupBy('c.id')
        .then(categories => res.json(categories))
        .catch(err => res.status(500).send(err))
        
    }

    return {get}
}
