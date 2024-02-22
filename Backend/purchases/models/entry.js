const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Entry = sequelize.define('entry',{
    purchaseInvoice : {type : DataTypes.STRING, allowNull: false},
    purachseDate: {type : DataTypes.DATEONLY, defaultValue: Date.now(), allowNull: false},
    distributorId: {type : DataTypes.INTEGER, allowNull: false},
    purchaseAmount: {type :DataTypes.FLOAT, allowNull: false},
    eWayBillNo: {type : DataTypes.STRING},
    status: {type : DataTypes.STRING, allowNull: false},
    chequeNo: {type : DataTypes.STRING},
    chequeIssuedDate: {type : DataTypes.DATEONLY},
    invoiceDate: {type : DataTypes.DATEONLY},
    transportation: {type : DataTypes.FLOAT, defaultValue: 0},
    unloading: {type : DataTypes.FLOAT, defaultValue: 0},
    commission: {type : DataTypes.FLOAT, defaultValue: 0},
    paymentMode: {type : DataTypes.STRING},
    purchaseOrderId : {type : DataTypes.INTEGER},
    userId : {type : DataTypes.INTEGER, allowNull: false },
    remarks : {type: DataTypes.STRING}
},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = Entry;


