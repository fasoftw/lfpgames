const express = require("express");
const app = express();
const bodyParser = require("body-parser");
 
 
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res)=> {
    res.send('<h1> Eu sou eu. </h1>')
})

app.listen(3000, ()=>{
    console.log("APP RODANDO");
 
});
