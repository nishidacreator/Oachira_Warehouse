const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Customer = sequelize.define('customer',{
    name : {type : DataTypes.STRING, allowNull : false},
    subledgerCode : {type : DataTypes.STRING, allowNull : false},
    address1 : {type : DataTypes.STRING},
    address2 : {type : DataTypes.STRING},
    state : {type : DataTypes.STRING},
    gstNo : {type : DataTypes.STRING},
    remarks : {type : DataTypes.STRING},
    email: {type : DataTypes.STRING},
    loyaltyPoint : {type : DataTypes.FLOAT},
    customerCategoryId : {type: DataTypes.INTEGER, allowNull : false},
    customerGradeId : {type: DataTypes.INTEGER, allowNull : false},
},
{
    freezeTableName: true,
    timestamps: false
})


module.exports = Customer;


