const Sequelize = require("sequelize");

// const connection = new Sequelize ('lfp', 'fasoft', 'Friden8781',{
//     host: 'mysql669.umbler.com',
//     dialect: 'mysql',
//     timezone: "-03:00" //define timezone no sequelize
// });

const connection = new Sequelize ('lfpgames', 'root', 'root',{
    host: 'localhost',
    dialect: 'mysql',
    timezone: "-03:00" //define timezone no sequelize
});

module.exports = connection;