const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Coolie = sequelize.define('coolie',{
    secondaryUnitId : {type : DataTypes.INTEGER, allowNull : false},
    amount : {type : DataTypes.FLOAT, defaultValue : 0}
},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = Coolie;


