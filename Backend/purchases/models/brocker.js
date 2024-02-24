const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Brocker = sequelize.define('brocker',{
    productId : {type : DataTypes.INTEGER, allowNull : false},
    brokerName : {type : DataTypes.STRING, allowNull : false},
    rate : {type : DataTypes.FLOAT, allowNull : false},
},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = Brocker;


