const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Brand = sequelize.define('brand',{
    brandName : {type : DataTypes.STRING, allowNull : false},
    status: {type : DataTypes.BOOLEAN, defaultValue : true},

    cloudinaryId : {type:DataTypes.STRING},
    fileUrl : {type:DataTypes.STRING} 
},
{
    freezeTableName: true,
    timestamps: false
})


module.exports = Brand;


