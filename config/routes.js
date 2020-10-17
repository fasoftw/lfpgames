const admin = require('./admin')

module.exports = app => {

    
    app.post('/signup', app.api.user.save) // para criar conta
    app.post('/signin', app.api.auth.signIn) //para logar
    app.post('/validateToken', app.api.auth.validateToken)

    
    app.route('/users')
        .all(app.config.passport.authenticate())
        .get(admin(app.api.user.get))
        .post(app.api.user.save)
    
    app.route('/users/:id')
        .get(app.api.user.getById)
        .put(app.api.user.save)

    app.route('/')
        .get(app.api.testeValidations.get)
}