const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Hsn = sequelize.define('hsn',{
    hsnName : {type : DataTypes.STRING, allowNull : false},
    status: {type : DataTypes.BOOLEAN, defaultValue : true}
},
{
    freezeTableName: true,
    timestamps: false
})


module.exports = Hsn;


