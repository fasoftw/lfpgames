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
                res.redirect("/admin/users");
            }).catch((err) => {
                res.redirect("/admin/users");
            })

        } else {
            res.redirect("/admin/users");
        }
    })

})



module.exports = router;