const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Entry = sequelize.define('entry',{
    purchaseOrderId : {type : DataTypes.INTEGER, allowNull : false},
    userId : {type : DataTypes.INTEGER, allowNull : false},
    purchaseInvoice : {type : DataTypes.STRING, allowNull : false},
    purachseDate: {type : DataTypes.DATE, allowNull : false},
    paymentMode: {type : DataTypes.STRING, allowNull : false},
    purchaseAmount: {type :DataTypes.FLOAT, allowNull : false},
    eWayBillNo: {type : DataTypes.STRING, allowNull : false},
    transportationCharge: {type : DataTypes.FLOAT, allowNull : false},
    unloading: {type : DataTypes.BOOLEAN, allowNull : false},
    unloadingTeam: {type : DataTypes.STRING, allowNull : false},
    commission: {type : DataTypes.BOOLEAN, allowNull : false},
},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = Entry;


