const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const PurchaseTransporter = sequelize.define('purchaseTransporter',{
    invoiceNo: {type : DataTypes.STRING, allowNull : false},
    transporterId : {type : DataTypes.INTEGER},
    amount : {type : DataTypes.FLOAT, defaultValue : 0},
    date: {type : DataTypes.DATEONLY, defaultValue :new Date()},
    vehicleNo: {type : DataTypes.STRING},
    from: {type : DataTypes.STRING},
    noOfBags: {type : DataTypes.INTEGER},
    advance: {type : DataTypes.FLOAT, defaultValue: 0},
    entryId: {type : DataTypes.INTEGER},
    status: {type : DataTypes.STRING, defaultValue: "generated"},
    closedDate: {type : DataTypes.DATEONLY},
    chequeNo: {type : DataTypes.STRING}
},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = PurchaseTransporter;


