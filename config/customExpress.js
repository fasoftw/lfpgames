const express = require('express')
const bodyParser = require('body-parser')
const connection = require('../database/database.js');

 const app = express();

 const user = require('../src/app/models/User');
 
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: true }));
 
 const sessaoAutenticacao = require('./auth');
 sessaoAutenticacao(app);

  connection.authenticate()
  .then(() => {
      

      console.log("Conexão feita com o banco de dados");
  })
  .catch((msgErro) => {
      console.log(msgErro);
  });

  app.get('/', (req, res) => {
  
    res.send('<h1> Eu sou eu. </h1>')
  });
 

module.exports = app;