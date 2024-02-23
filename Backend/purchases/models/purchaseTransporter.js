const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const PurchaseTransporter = sequelize.define('purchasetransporter',{
    transporterId : {type : DataTypes.INTEGER, allowNull : false},
    amount : {type : DataTypes.FLOAT, defaultValue : 0},
    date: {type : DataTypes.DATEONLY, defaultValue :new Date()},
    vehicleNo: {type : DataTypes.STRING},
    from: {type : DataTypes.STRING},
    noOfBags: {type : DataTypes.STRING},
    advance: {type : DataTypes.FLOAT, defaultValue: 0},
    peId: {type : DataTypes.INTEGER},
    status: {type : DataTypes.STRING}

},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = PurchaseTransporter;


