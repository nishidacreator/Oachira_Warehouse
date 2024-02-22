const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Order = sequelize.define('order',{
    orderNo : {type : DataTypes.STRING},
    distributorId : {type : DataTypes.INTEGER},
    userId : {type : DataTypes.INTEGER},
    companyId : { type : DataTypes.INTEGER},
    // warehouseId: {type : DataTypes.INTEGER},
    date: {type : DataTypes.DATEONLY, defaultValue: Date.now()},
    status: {type : DataTypes.STRING},

},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = Order;


