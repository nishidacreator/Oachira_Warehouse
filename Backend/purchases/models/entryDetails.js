const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const EntryDetails = sequelize.define('entryDetails',{
    entryId: {type : DataTypes.INTEGER, },
    productId : {type : DataTypes.INTEGER, },
    mrp:{type: DataTypes.INTEGER, },
    rate:{type: DataTypes.INTEGER, },
    gross:{type: DataTypes.INTEGER, },
    discount : {type: DataTypes.INTEGER, },
    sgst : {type: DataTypes.INTEGER, },
    cgst :  {type: DataTypes.INTEGER, },
    net :  {type: DataTypes.INTEGER, },
    rent :  {type: DataTypes.INTEGER, },
    commision : {type: DataTypes.INTEGER, },
    profit : {type: DataTypes.INTEGER, },
    salePrice : {type: DataTypes.INTEGER, },
    quantity : {type : DataTypes.FLOAT, },
    unitId : {type : DataTypes.INTEGER}
},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = EntryDetails;


