const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Tax = sequelize.define('tax',{
    //id : { type : DataTypes.NUMBER, primaryKey : true, allowNull : false, autoIncrement : true},
    taxName : {type : DataTypes.STRING, allowNull : false},
    igst : {type : DataTypes.FLOAT, allowNull : false},
    cgst :  {type : DataTypes.FLOAT},
    sgst :  {type : DataTypes.FLOAT},
},
{
    freezeTableName: true,
    timestamps : false
})

module.exports = Tax;


