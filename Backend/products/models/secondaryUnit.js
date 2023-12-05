const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const SecondaryUnit = sequelize.define('secondaryUnit',{
    secondaryUnitName : {type : DataTypes.STRING, allowNull : false},
    primaryUnitId : {type : DataTypes.INTEGER, allowNull : false},
    primaryFactor : {type : DataTypes.FLOAT, allowNull : false},
    secondaryFactor : {type : DataTypes.FLOAT, defaultValue : 1},
},
{
    freezeTableName: true,
    timestamps: false
})

module.exports = SecondaryUnit;


