const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Order = sequelize.define('order',{
    orderNo : {type : DataTypes.STRING , allowNull : false},
    distributorId : {type : DataTypes.INTEGER, allowNull : false},
    userId : {type : DataTypes.INTEGER},
    companyId : { type : DataTypes.INTEGER, allowNull : false},
    date: {type : DataTypes.DATEONLY, defaultValue: Date.now(), allowNull : false},
    status: {type : DataTypes.STRING},

},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = Order;


