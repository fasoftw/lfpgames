const customExpress = require('./config/customExpress')
const express = require("express");
const app = express();
const connection = require('./database/database');

//Models
const User = require("./src/models/User");

connection.authenticate()
    .then(() => {
        const app = customExpress()

        app.listen(3000, () => console.log('Servidor rodando na porta 3000'));

        console.log("Conexão feita com o banco de dados");
    })
    .catch((msgErro) => {
        console.log(msgErro);
    });

app.get('/', (req, res) => {
    res.send('<h1> Eu sou eu. </h1>')
})


