const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Slip = sequelize.define('slip',{
    purchaseEntryId : {type : DataTypes.INTEGER, allowNull : false},
    invoiceNo : { type: DataTypes.STRING, allowNull : false},
    amount: {type : DataTypes.FLOAT, allowNull : false},
    description: { type : DataTypes.STRING},
    date:  {type : DataTypes.DATEONLY, defaultValue: Date.now(), allowNull : false},
    contactPerson: { type : DataTypes.STRING, allowNull : false},
    status : { type : DataTypes.STRING, defaultValue: 'Open'}

},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = Slip;


