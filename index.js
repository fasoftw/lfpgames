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

var port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(process.env.NODE_ENV)
    console.log(port)
    console.log("Backend Executando...");
})
