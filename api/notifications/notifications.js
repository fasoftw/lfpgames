module.exports = app =>{

    const { existsOrError }  = app.api.validation

    const save = async (req,res) =>{
        const notification = {...req.body}
        console.log(notification)

        try{

            if(!req.params.id){
                existsOrError(notification.notificationId, 'Error notification Id')
                existsOrError(notification.userId, 'Error user Id')
            }

        }catch(err){
            res.status(400).send(err)
        }

        if(!req.params.id){
            await app.db('party_notifications')
            .insert({

                createdAt: new Date(),
                nameParty: notification.nameParty,
                notificationId:notification.notificationId,
                userId: notification.userId
                
            }).then( resp =>{
                res.status(201).send(resp)
            }).catch(err => res.status(500).send(err))

         } else {
           
            app.db('party_notifications')
            .update({
                readedAt: new Date(),           
            })
            .where({id: req.params.id})
            .then( () =>{
                res.status(201).send()
            }).catch(err => res.status(500).send(err))

         }
    }

    //by id user
    const getById = async (req,res) =>{
        
         await app.db('party_notifications as pn')
        .join('notifications', 'notifications.id', 'pn.notificationId')
        .where({ 'pn.userId': req.params.id})
        .select('notifications.*', 'pn.readedAt','pn.id as notificationID','pn.nameParty as partyName','pn.createdAt')         
        .orderBy('createdAt', 'desc')
        .then(not=> res.json(not))
        .catch(err => console.log(err))
    }

    const remove = async ( req, res)=>{
        await app.db('party_notifications')
        .where({id: req.params.id}).del()
        .then(()=>  res.status(204).send())
        .catch(err => {

        return res.status(400).send(err)

        })
    }

    return {save,getById,remove}
}