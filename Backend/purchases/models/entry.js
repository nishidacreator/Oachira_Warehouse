const { DataTypes,Sequelize } = require('sequelize');
const sequelize = require('../../utils/db');

const Entry = sequelize.define('entry',{
    purchaseInvoice : {type : DataTypes.STRING},
    purachseDate: {type : DataTypes.DATEONLY},
    distributorId: {type : DataTypes.INTEGER, allowNull: false},
    purchaseAmount: {type :DataTypes.FLOAT, allowNull: false},
    eWayBillNo: {type : DataTypes.STRING},
    status: {type : DataTypes.STRING, allowNull: false},
    chequeIssuedDate: {type : DataTypes.DATEONLY},
    invoiceDate: {type : DataTypes.DATEONLY},
    transportation: {type : DataTypes.FLOAT, defaultValue: 0},
    unloading: {type : DataTypes.FLOAT, defaultValue: 0},
    commission: {type : DataTypes.FLOAT, defaultValue: 0},
    paymentMode: {type : DataTypes.STRING},
    orderId : {type : DataTypes.INTEGER},
    userId : {type : DataTypes.INTEGER, allowNull: false },
    remarks : {type: DataTypes.STRING},
    entryStatus: {type : DataTypes.STRING, defaultValue:'pending'},
    advanceAmount: {type : DataTypes.FLOAT}
},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = Entry;


