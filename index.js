const app = require('express')() 

const db = require('./config/db')

const consign = require('consign')



app.db = db

consign()
    .include('./config/passport.js')
    .include('./config/middlewares.js')
    .include('./api/validation.js')
    .include('./api')
    .then('./config/routes.js')
    .into(app)


app.listen(4000, ()=>{
    console.log("Backend Executando...");
})
