const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');


const distributorLedger = sequelize.define('distributorLedger',{
    distributorId:{type: DataTypes.INTEGER, allowNull:false},
    date:{type: DataTypes.DATEONLY, defaultValue: Date.now()},
    description:{type: DataTypes.STRING},
    amount:{type:DataTypes.FLOAT,allowNull: false},
    transactionType: {type: DataTypes.STRING,allowNull: false}
},{
    freezeTableName:true,
    timestamps:true
})

module.exports = distributorLedger; 