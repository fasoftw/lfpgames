module.exports = app =>{

    const { existsOrError }  = app.api.validation

    const save = (req,res) =>{
        const notification = {...req.body}
        console.log(notification)

        try{

            existsOrError(notification.notificationId, 'Error notification Id')
            existsOrError(notification.userId, 'Error user Id')
            existsOrError(notification.createdAt, 'Error date')

        }catch(err){
            res.status(400).send(err)
        }

        if(!req.params.id){
            app.db('party_notifications')
            .insert({

                createdAt: new Date(),
                nameParty: notification.nameParty,
                notificationId:notification.notificationId,
                userId: notification.userId
                
            }).then( resp =>{
                console.log(resp)
                res.status(201).send(resp)
            }).catch(err => res.status(500).send(err))
         } else {
           
            app.db('party_notifications')
            .update({
                readedAt: notification.readedAt,           
            })
            .where({id: req.params.id})
            .then( () =>{
                res.status(201).send()
            }).catch(err => res.status(500).send(err))

         }
    }

    const getById = async (req,res) =>{
        
         await app.db('party_notifications as pn')
        .join('notifications', 'notifications.id', 'pn.notificationId')
        .where({ 'pn.userId': req.params.id})
        .select('notifications.*', 'pn.readedAt','pn.id as notificationID')         
        .then(not=> res.json(not))
        .catch(err => console.log(err))
    }

    return {save,getById}
}