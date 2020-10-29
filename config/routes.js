const admin = require('./admin')

module.exports = app => {

    app.post('/signup', app.api.user.save) 
    app.post('/signin', app.api.auth.signIn) 
    app.post('/validateToken', app.api.auth.validateToken)

    
    app.route('/users')
 //       .all(app.config.passport.authenticate())
 //       .get(admin(app.api.user.get))
        .get(app.api.user.get)
        .post(app.api.user.save)
    
    app.route('/users/:id')
        .get(app.api.user.getById)
        .put(app.api.user.save)
        .delete(app.api.user.remove)
    
    app.route('/games')
        .post(app.api.games.save)
        .get(app.api.games.get)
      

    app.route('/games/:id')
        .put(app.api.games.save)
        .delete(app.api.games.remove)

    app.route('/platforms')
        .get(app.api.platforms.get)


    app.route('/categories')
        .post(app.api.categories.save)
        .get(app.api.categories.get)

    app.route('/filters')
        .post(app.api.filters.save)
        .get(app.api.filters.get)

  
}