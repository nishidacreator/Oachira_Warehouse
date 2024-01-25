const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Order = sequelize.define('order',{
    orderNo : {type : DataTypes.STRING, allowNull : false},
    distributorId : {type : DataTypes.INTEGER, allowNull : false},
    userId : {type : DataTypes.INTEGER, allowNull : false},
    warehouseId: {type : DataTypes.INTEGER, allowNull : false},
    date: {type : DataTypes.DATEONLY, defaultValue: Date.now()},
    status: {type : DataTypes.STRING, allowNull : false},
},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = Order;


