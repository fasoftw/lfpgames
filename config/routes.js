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
        .get(app.api.games.getById)

    app.route('/game/:id/filters')
        .get(app.api.game.filters.get)
    
    app.route('/game/profile/user')
       .post(app.api.game.user.profile.save)    

    app.route('/game/profile/user/:id')
        .delete(app.api.game.user.profile.remove)
        .get(app.api.game.user.profile.get)

    app.route('/game/:id/platforms')
        .get(app.api.game.platforms.get)

    app.route('/game/:id/parties')
        .get(app.api.game.parties.get)    


    app.route('/platforms')
        .get(app.api.platforms.get)      


    app.route('/categories')
        .post(app.api.categories.save)
        .get(app.api.categories.get)
    
    app.route('/categories/:id')
        .put(app.api.categories.save)
        .delete(app.api.categories.remove)


    app.route('/filters')
        .post(app.api.filters.save)
        .get(app.api.filters.get)


    app.route('/parties')
        .post(app.api.parties.save)
        .get(app.api.parties.get)
    
    app.route('/parties/:id')
        .put(app.api.parties.save)
   

    app.route('/articles')
        .get(app.api.articles.get)
        .post(app.api.articles.save)

    app.route('/articles/:id')
        .get(app.api.articles.getById)
        .put(app.api.articles.save)
        .delete(app.api.articles.remove)

  
}