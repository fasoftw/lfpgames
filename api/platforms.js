module.exports = app => {
    
    const get = (req,res) =>{
        app.db('platforms')
        .whereNull('deletedAt')
        .orderBy('name')
        .then(platforms => res.json(platforms))
        .catch(err => res.status(500).send(err))
    }
    
    return {get}
}
