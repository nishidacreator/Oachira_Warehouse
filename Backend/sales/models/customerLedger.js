const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const CustomerLedger = sequelize.define('customerLedger',{
    customerId : {type: DataTypes.INTEGER, allowNull : false},
    invoiceNo : {type: DataTypes.STRING, allowNull : false},
    date : {type: DataTypes.DATEONLY, allowNull : false, defaultValue: new Date()},
    debit : {type: DataTypes.FLOAT},
    credit : {type: DataTypes.FLOAT}
},
{
    freezeTableName: true,
    timestamps: false
})

module.exports = CustomerLedger
