const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Entry = sequelize.define('entry',{
    purchaseOrderId : {type : DataTypes.INTEGER, },
    userId : {type : DataTypes.INTEGER, },
    purchaseInvoice : {type : DataTypes.STRING, },
    purachseDate: {type : DataTypes.DATEONLY, defaultValue: Date.now()},
    paymentMode: {type : DataTypes.STRING, },
    purchaseAmount: {type :DataTypes.FLOAT, },
    eWayBillNo: {type : DataTypes.STRING, },
    loading:{type: DataTypes.INTEGER},
    transportationCharge: {type : DataTypes.FLOAT, },
    unloading: {type : DataTypes.BOOLEAN, },
    unloadingTeam: {type : DataTypes.STRING, },
    commission: {type : DataTypes.BOOLEAN, },
    chequeNo:{type: DataTypes.INTEGER}
},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = Entry;


