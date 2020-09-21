const express = require("express");
const router = express.Router();

const User = require("../models/User");  // importando o model


router.get("/admin/users", (req, res) => {
    User.findAll().then(users => {
        res.send({
            users: users
        });
    });
})

router.post("/users/create", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var nick = req.body.nick;
    var name = req.body.name;

    console.log(email);
    console.log(password);
    User.findOne({
        where: {
            email: email
        }
    }).then(user => {
        if (user == undefined) {

            User.create({
                email: email,
                password: password,
                nick: nick,
                name: name
            }).then(() => {
                console.log("CadastroRealizado");
                res.redirect("/admin/users");
            }).catch((err) => {
                console.log("Erro no cadastro   ");
                res.redirect("/admin/users");
            })

        } else {
            console.log("Cadastro JÁ realizdo");
            res.redirect("/admin/users");
        }
    })

})

//delete user

router.delete("/users/:id", (req, res) => {
    var id = req.params.id;
    User.findOne({
        where: {
            id: id
        }
    }).then(user => {
        if (id != undefined) {
            if (!isNaN(id)) { 
                User.destroy({
                    where: { id: id }
                }).then(() => {
                    res.redirect("/admin/users")
                });
            } else {
                res.redirect("/admin/users")
            }
        }
        else {  
            res.redirect("/admin/users")
        }
    })
})



module.exports = router;