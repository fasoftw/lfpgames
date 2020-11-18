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




    app.route('/platforms')
        .get(app.api.platforms.get)      
    
    app.route('/platforms/:id')
        .get(app.api.platforms.getByIdGame)




    app.route('/categories')
        .post(app.api.categories.save)
        .get(app.api.categories.get)
    
    app.route('/categories/:id')
        .put(app.api.categories.save)
        .delete(app.api.categories.remove)




    app.route('/filters')
        .post(app.api.filters.save)
        .get(app.api.filters.get)

    app.route('/filters/:id')
        .get(app.api.filters.getByIdGame)




    app.route('/parties')
        .post(app.api.parties.save)
        .get(app.api.parties.get)
    
    app.route('/parties/:id')
        .put(app.api.parties.save)
       
    app.route('/filtersParties/:id')
        .get(app.api.filtersParties.getByIdParty)

    app.route('/filtersParties')
        .get(app.api.filtersParties.get)
   
    app.route('/gamesParties/:id')
        .get(app.api.gamesParties.get)
        .get(app.api.gamesParties.getPartyUsers)

        
    app.route('/gameProfile')
        .post(app.api.gameProfile.save)
        .put(app.api.gameProfile.save)
    
    app.route('/gameProfile/:id')
        .get(app.api.gameProfile.getById)

    app.route('/gameProfileUser/:id')
        .get(app.api.gameProfileUser.getByIdUser)
        .delete(app.api.gameProfileUser.remove)
    


    app.route('/articles')
        .get(app.api.articles.get)
        .post(app.api.articles.save)

    app.route('/articles/:id')
        .get(app.api.articles.getById)
        .put(app.api.articles.save)
        .delete(app.api.articles.remove)

  
}