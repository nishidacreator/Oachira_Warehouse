const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Loading = sequelize.define('loading',{
    name : {type : DataTypes.STRING, allowNull : false}
},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = Loading;


