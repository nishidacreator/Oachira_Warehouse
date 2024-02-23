const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Bank = sequelize.define('bank', {
    companyId:{type : DataTypes.INTEGER},
    accountNumber:{type : DataTypes.INTEGER},
    accountHolderName:{type : DataTypes.STRING},
    bankName:{type : DataTypes.STRING},
    bankAddress:{type : DataTypes.STRING},
    ibanNumber:{type : DataTypes.STRING},
    swiftCode:{type : DataTypes.STRING},
    vat:{type :DataTypes.STRING},
    remarks:{type : DataTypes.STRING},

},
{
    freezeTableName: true
})


module.exports = Bank;


   

 