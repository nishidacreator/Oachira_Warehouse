const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const OrderDetails = sequelize.define('orderDetails',{
    orderId : {type : DataTypes.INTEGER, allowNull : false},
    productId : {type : DataTypes.INTEGER, allowNull : false},
    quantity : {type : DataTypes.FLOAT, allowNull : false},
    secondaryUnitId : {type : DataTypes.INTEGER}
},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = OrderDetails;


