

module.exports = (app) =>{
    var user = {
        id:1,
        name:"Debora Cristina Ferreira",
        email:"deboracrisf91@gmail.com",
        password: "nodejs"
    };

    app.post("/auth", (req,res)=>{
        var {email,password} = req.body;
        console.log(req.body);
        if(email != undefined){
     
            // var user = users.find(u =>{
            //     u.email == email;
            // });
     
            if(user != undefined){
     
                if(user.password == password && user.email == email){
                    res.status(200); //Estas requisição foi bem sucedida
                    res.json({token: "TOKEN VERDADEIRO"});
                }else{
                    res.status(401); //Embora o padrão HTTP especifique "unauthorized", semanticamente, essa resposta significa "unauthenticated". Ou seja, o cliente deve se autenticar para obter a resposta solicitada.
                    res.json({err: "Credenciais inválidas"});
                }
     
            } else {
                res.status(404); //O servidor não pode encontrar o recurso solicitado. Este código de resposta talvez seja o mais famoso devido à frequência com que acontece na web.
                res.json({err: "O email enviado não consiste na base de dados"});
            }
     
        } else {
            res.status(400); //Essa resposta significa que o servidor não entendeu a requisição pois está com uma sintaxe inválida.
            res.json({err: "O email enviado é inválido"});
        }
    })
    
    
    
}
