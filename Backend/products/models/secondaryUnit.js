const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const SecondaryUnit = sequelize.define('secondaryUnit',{
    secondaryUnitName : {type : DataTypes.STRING, allowNull : false},
    primaryUnitId : {type : DataTypes.INTEGER, allowNull : false},
    primaryFactor : {type : DataTypes.FLOAT, allowNull : false},
    secondaryFactor : {type : DataTypes.FLOAT, defaultValue : 1},
    loadingCharge : {type : DataTypes.FLOAT},   
    status: {type : DataTypes.BOOLEAN, defaultValue : true},
},
{
    freezeTableName: true,
    timestamps: false
})

module.exports = SecondaryUnit;


