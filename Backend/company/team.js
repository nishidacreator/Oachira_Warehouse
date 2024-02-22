const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');



const Team = sequelize.define('team', {
    teamName: { type: DataTypes.STRING },
    userId: { type: DataTypes.INTEGER },

},
    {
        freezeTableName: true
    })


module.exports = Team;