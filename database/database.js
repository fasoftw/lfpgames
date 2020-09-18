const Sequelize = require("sequelize");

const connection = new Sequelize ('lfpgames', 'root', 'root',{
    host: 'localhost',
    dialect: 'mysql',
    timezone: "-03:00" //define timezone no sequelize
});

module.exports = connection;