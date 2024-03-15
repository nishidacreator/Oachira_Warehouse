const { DataTypes,Sequelize } = require('sequelize');
const sequelize = require('../../utils/db');

const Entry = sequelize.define('entry',{
    purchaseInvoiceNo : {type : DataTypes.STRING},
    distributorId: {type : DataTypes.INTEGER, allowNull: false},
    eWayBillNo: {type : DataTypes.STRING},
    paymentMode: {type : DataTypes.STRING},
    orderId : {type : DataTypes.INTEGER},
    userId : {type : DataTypes.INTEGER, allowNull: false },
    remarks : {type: DataTypes.STRING},

    status: {type : DataTypes.STRING, allowNull: false},
    entryStatus: {type : DataTypes.STRING, defaultValue:'pending'},

    purchaseAmount: {type :DataTypes.FLOAT, allowNull: false},
    advanceAmount: {type : DataTypes.FLOAT},
    transportation: {type : DataTypes.FLOAT, defaultValue: 0},
    unloading: {type : DataTypes.FLOAT, defaultValue: 0},
    commission: {type : DataTypes.FLOAT, defaultValue: 0},

    purchaseDate: {type : DataTypes.DATEONLY},
    // chequeIssuedDate: {type : DataTypes.DATEONLY},
    invoiceDate: {type : DataTypes.DATEONLY},
    updatedDate: {type : DataTypes.DATEONLY},
},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = Entry;


