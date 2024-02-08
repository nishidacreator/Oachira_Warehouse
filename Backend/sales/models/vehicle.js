const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Vehicle = sequelize.define('vehicle',{
    registrationNumber : {type : DataTypes.STRING, allowNull : false},
    vehicleTypeId : {type : DataTypes.INTEGER, allowNull : false},
    taxExpiry : {type : DataTypes.DATEONLY, allowNull : false},
    insuranceExpiry : {type : DataTypes.DATEONLY, allowNull : false},
    polutionExpiry : {type : DataTypes.DATEONLY, allowNull : false},
    capacity : {type : DataTypes.STRING},
    permitExpiry : {type : DataTypes.DATEONLY, allowNull : false},
    fitnessExpiry : {type : DataTypes.DATEONLY, allowNull : false},
    vehicle_image: {type : DataTypes.STRING},
    status : {type : DataTypes.BOOLEAN, defaultValue : true},
},
{
    freezeTableName: true,
    timestamps: false
})

module.exports = Vehicle;


