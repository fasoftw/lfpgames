module.exports = app =>{

    const getById = async (req,res) =>{
        
         await app.db('party_notifications as pn')
        .count('pn.id as count')
        .join('notifications', 'notifications.id', 'pn.notificationId')
        .where({ 'pn.userId': req.params.id})
        .whereNull("readedAt")
        .then(not=> res.json(not))
        .catch(err => console.log(err))
    }



    return {getById}
}