const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Slip = sequelize.define('slip',{
    entryId : {type : DataTypes.INTEGER, allowNull : false},
    distributorId : {type : DataTypes.INTEGER, allowNull : false},
    invoiceNo : { type: DataTypes.STRING, allowNull : false},
    amount: {type : DataTypes.FLOAT, allowNull : false},
    description: { type : DataTypes.STRING},
    date:  {type : DataTypes.DATEONLY, defaultValue: Date.now()},
    contactPerson: { type : DataTypes.STRING},
    status : { type : DataTypes.STRING, defaultValue: 'open'},
    purchaseInvoice : { type : DataTypes.STRING, allowNull: false},
},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = Slip;


