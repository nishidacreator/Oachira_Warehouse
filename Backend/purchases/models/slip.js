const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Slip = sequelize.define('slip',{
    purchaseEntryId : {type : DataTypes.INTEGER},
    InvoiceNo : { type: DataTypes.STRING},
    amount: {type : DataTypes.INTEGER },
    description: { type : DataTypes.STRING},
    date:  {type : DataTypes.DATEONLY, defaultValue: Date.now()},
   contactPerson: { type : DataTypes.STRING},
   status : { type : DataTypes.STRING},
  


},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = Slip;


