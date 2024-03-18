const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Distributor = sequelize.define('distributor',{
    distributorName : {type : DataTypes.STRING, allowNull : false},
    address1 : {type : DataTypes.STRING, allowNull : false},
    address2 : {type : DataTypes.STRING},
    state : {type : DataTypes.STRING},
    phoneNumber : {type : DataTypes.STRING, allowNull : false},
    gstNo : {type : DataTypes.STRING},
    panNo : {type : DataTypes.STRING},
    contactPerson : {type : DataTypes.STRING, allowNull : false},
    fssaiNo : {type : DataTypes.STRING},
    brokerage: {type : DataTypes.BOOLEAN, allowNull : false, defaultValue : false},
    advance: {type : DataTypes.BOOLEAN, allowNull : false, defaultValue : false},
    unloading: {type : DataTypes.BOOLEAN, allowNull : false, defaultValue : false},
    transportation: {type : DataTypes.BOOLEAN, allowNull : false,  defaultValue : false},
    status: {type : DataTypes.BOOLEAN, defaultValue : true},

    cloudinaryId : {type:DataTypes.STRING},
    fileUrl : {type:DataTypes.STRING} 
},
{
    freezeTableName: true,
    timestamps: false
})


module.exports = Distributor;


