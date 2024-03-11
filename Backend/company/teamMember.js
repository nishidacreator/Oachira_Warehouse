const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');



const TeamMember = sequelize.define('teamMember', {
    teamId: { type: DataTypes.INTEGER },
    userId: { type: DataTypes.INTEGER }
},
    {
        freezeTableName: true
    })


module.exports = TeamMember;