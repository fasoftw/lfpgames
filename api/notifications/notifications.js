module.exports = app =>{

    const { existsOrError }  = app.api.validation

    const save = async (req,res) =>{
        const notification = {...req.body}

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
            let array = req.params.id.split(",");
            app.db('party_notifications')
            .update({
                readedAt: new Date(),           
            })
            .whereIn('id', array)
            .then( () =>{
                res.status(201).send()
            }).catch(err => res.status(500).send(err))

         }
    }

    //by id user
    const getById = async (req,res) =>{
        const limit = 5
        const page = req.query.page || 1



         await app.db('party_notifications as pn')
        .join('notifications', 'notifications.id', 'pn.notificationId')
        .where({ 'pn.userId': req.params.id})
        .select('notifications.*', 'pn.readedAt','pn.id as notificationID','pn.nameParty as partyName','pn.createdAt')         
        .limit(limit).offset(page * limit - limit)
        .orderBy('createdAt', 'desc')
        .then(not=> res.json({not,limit}))
        .catch(err => console.log(err))
    }

    const remove = async ( req, res)=>{
        let array = req.params.id.split(",");
        await app.db('party_notifications')
        .whereIn('id', array).del()
        .then(()=>  res.status(204).send())
        .catch(err => {
        console.log(err)
        return res.status(400).send(err)

        })
    }

    return {save,getById,remove}
}