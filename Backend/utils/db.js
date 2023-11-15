const {Sequelize} = require('sequelize')


const sequelize = new Sequelize('oac_warehouse', 'oachira', 'oachira', {
    host: 'localhost',
    dialect: 'postgres' 
});

  
module.exports = sequelize