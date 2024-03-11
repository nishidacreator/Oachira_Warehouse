const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const PurchaseLoading = sequelize.define('purchaseLoading',{
    entryId: {type: DataTypes.INTEGER, allowNull: false},
    invoiceNo: {type : DataTypes.STRING, allowNull : false},
    loadingId : {type : DataTypes.INTEGER, allowNull : false},
    noOfBags: {type : DataTypes.INTEGER},
    noOfBox: {type : DataTypes.INTEGER},
    amount : {type : DataTypes.FLOAT, defaultValue : 0},
    date: {type : DataTypes.DATEONLY, defaultValue :new Date()},
    status: {type : DataTypes.STRING, defaultValue: "opened"},
    closedDate: {type : DataTypes.DATEONLY}
},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = PurchaseLoading;


