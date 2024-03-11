const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const LoadingTeam = sequelize.define('loadingteam',{
    teamname : {type : DataTypes.STRING, allowNull : false}
},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = LoadingTeam;


