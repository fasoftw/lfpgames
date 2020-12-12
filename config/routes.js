const admin = require('./admin')

module.exports = app => {

    app.post('/signup', app.api.user.save) 
    app.post('/signin', app.api.auth.signIn) 
    app.post('/validateToken', app.api.auth.validateToken)

    
    app.route('/users')
        .all(app.config.passport.authenticate())
 //       .all(app.config.passport.authenticate())
 //       .get(admin(app.api.user.get))
        .get(app.api.user.get)
        .post(app.api.user.save)
    
    app.route('/users/:id')
    .all(app.config.passport.authenticate())
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
    .all(app.config.passport.authenticate())
        .get(app.api.game.filters.get)
    
    app.route('/game/profile/user')
    .all(app.config.passport.authenticate())
       .post(app.api.game.user.profile.save)    

    app.route('/game/profile/user/:id')
    //.all(app.config.passport.authenticate())
        .delete(app.api.game.user.profile.remove)
        .get(app.api.game.user.profile.get)

    app.route('/user/:userId/game/:gameId/platform/:platformId')
    //.all(app.config.passport.authenticate())
        .get(app.api.game.user.profile.getById)

    app.route('/game/:id/platforms')
    //.all(app.config.passport.authenticate())
        .get(app.api.game.platforms.get)

    app.route('/game/:id/parties')
        .get(app.api.game.parties.get)    


    app.route('/platforms')
    .all(app.config.passport.authenticate())
        .get(app.api.platforms.get)      


    app.route('/categories')
    .all(app.config.passport.authenticate())
        .post(app.api.categories.save)
        .get(app.api.categories.get)
    
    app.route('/categories/:id')
    .all(app.config.passport.authenticate())
        .put(app.api.categories.save)
        .delete(app.api.categories.remove)


    app.route('/filters')
    .all(app.config.passport.authenticate())
        .post(app.api.filters.save)
        .get(app.api.filters.get)


    app.route('/parties')
    .all(app.config.passport.authenticate())
        .post(app.api.parties.save)
//        .get(app.api.parties.get) /*nem usa*/
    
    app.route('/parties/:id')
    .all(app.config.passport.authenticate())
        .put(app.api.parties.save)
        .delete(app.api.parties.remove)

    app.route('/party/user/:id/recommendation')
    .all(app.config.passport.authenticate())
        .get(app.api.party.user.recommendation.get)

    app.route('/party/user/:id')
    //.all(app.config.passport.authenticate())
        .get(app.api.party.user.parties.get)

    app.route('/party/:id/players')
        .post(app.api.party.players.save)
        .get(app.api.party.players.getById)

    app.route('/party/players')
        .get(app.api.party.players.get)



    app.route('/articles')
        .get(app.api.articles.get)
        .post(app.api.articles.save)

    app.route('/articles/:id')
        .get(app.api.articles.getById)
        .put(app.api.articles.save)
        .delete(app.api.articles.remove)

  
}