const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const PrimaryUnit = sequelize.define('primaryUnit',{
    primaryUnitName : {type : DataTypes.STRING, allowNull : false},
    value : {type : DataTypes.FLOAT, allowNull : false},
},
{
    freezeTableName: true,
    timestamps: false
})

module.exports = PrimaryUnit;


