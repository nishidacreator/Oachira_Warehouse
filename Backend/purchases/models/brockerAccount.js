const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const BrockerAccount = sequelize.define('brockerAccount',{
    brockerId : {type : DataTypes.INTEGER, allowNull : false},
    entryId : {type : DataTypes.INTEGER, allowNull : false},
    date : {type : DataTypes.DATEONLY, allowNull : false},
    bagNo : {type : DataTypes.INTEGER, allowNull : false},
    amount : {type : DataTypes.FLOAT, allowNull : false},
    status : {type : DataTypes.BOOLEAN, allowNull : false},
},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = BrockerAccount;


