const express = require("express");
const app = express();
const bodyParser = require("body-parser");

//teste
const connection = require('./database/database');

//Models
const User = require("./src/models/User");

connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com o banco de dados");
    })
    .catch((msgErro) => {
        console.log(msgErro);
    });






app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());




app.get('/', (req, res) => {
    res.send('<h1> Eu sou eu. </h1>')
})

app.listen(3000, () => {
    console.log("APP RODANDO");

});
