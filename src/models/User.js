const Sequelize = require("sequelize");
const connection = require("../../database/database");


const User = connection.define('users', {
    Name:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

User.sync({force:true});
module.exports = User;



