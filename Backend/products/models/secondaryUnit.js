const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const SecondaryUnit = sequelize.define('secondaryUnit',{
    secondaryUnitName : {type : DataTypes.STRING, allowNull : false},
    primaryUnitId : {type : DataTypes.INTEGER, allowNull : false},
    factor : {type : DataTypes.FLOAT, allowNull : false},
},
{
    freezeTableName: true,
    timestamps: false
})

module.exports = SecondaryUnit;


