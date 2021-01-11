const app = require('express')()
const server = require('http').createServer(app);

const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
});



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

consign()
    .include('./config/socket.js')
    .into(io) 

var port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(process.env.NODE_ENV)
    console.log(port)
    console.log("Backend Executando...");
})
