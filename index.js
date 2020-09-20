const app = require('./config/customExpress');



 //Controllers
 const usersController = require("./src/app/controllers/UsersController"); //importando as rotas do usuario


 //Models
 const User = require("./src/app/models/User");
 

//Rotas
app.use("/", usersController);  //Adicionando as rotas de usuarios


app.listen(3000, function() {
    console.log(`Servidor rodando na porta 3000`);
});