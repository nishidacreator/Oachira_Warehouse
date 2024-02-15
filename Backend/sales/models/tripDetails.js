const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const TripDetails = sequelize.define('tripDetails',{
    tripId : {type : DataTypes.INTEGER, allowNull : false},
    customerId  : {type : DataTypes.INTEGER, allowNull : false},
    amount : {type : DataTypes.FLOAT},
    invoiceNo : {type : DataTypes.STRING},
    status : {type : DataTypes.BOOLEAN, defaultValue : true},
},
{
    freezeTableName: true,
    timestamps: false
})

module.exports = TripDetails;


