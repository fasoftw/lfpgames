//Teste das validations
module.exports = app => {

    const {existsOrError, notExistsOrError, equalsOrError} = app.api.validation

    const get = ( req, res ) => {
       try{
            existsOrError('  Gustavo    ', 'Nada foi informado')
       } catch(msg){
            return res.status(400).send(msg)
       }
       return res.send('Deu tudo Ok,').status(204)
    }

    return { get }
}