const sequelize = require('./db');
const bcrypt = require('bcrypt');
const { JSON } = require('sequelize');


const Role = require('../users/models/role');
const User = require('../users/models/user');

const Category = require('../products/models/category');
const Product = require('../products/models/product');
const PrimaryUnit = require('../products/models/primayUnit');
const SecondaryUnit = require('../products/models/secondaryUnit');
const Brand = require('../products/models/brand');
const SubCategory = require('../products/models/subCategory');
const Gst = require('../products/models/gst');
const Location = require('../products/models/location');
const Hsn = require('../products/models/hsn');
const Distributor = require('../products/models/distributor');
const ProductDistributor = require('../products/models/productDistributor');
const Store = require('../store/models/store');
// const CustomerCategory = require('../models/Customer/customerCategory');
// const CustomerGrade = require('../models/Customer/customerGrade');
// const Customer = require('../models/Customer/customer');
// const Vendor = require('../models/vendor');
// const Branch = require('../models/branch');
// const BankAccount = require('../models/bankAccount');

// const PurchaseEntry = require('../models/Purchases/purchaseEntry');
// const PurchaseEntryDetails = require('../models/Purchases/purchaseEntryDetails');
// const VehicleType = require('../models/route/vehicleType');
// const Vehicle = require('../models/route/vehicle');
// const Route = require('../models/route/route');
// const CollectionDays = require('../models/route/collectionDays');
// const RouteDetails = require('../models/route/routeDetails');
// const PickList = require('../models/route/pickList');
// const PickListDetails = require('../models/route/pickListDetails');
// const DailyCollection = require('../models/route/dailyCollection');
// const Trip = require('../models/route/trip');
// const TripDetails = require('../models/route/tripDetails');
// const DeliveryDays = require('../models/route/deliveryDays');
// const BranchAccount = require('../models/branchAccount');

// const PurchaseOrder = require('../models/Purchases/purchaseOrder');
// const PurchaseOrderDetails = require('../models/Purchases/purchaseOrderDetails');
// const Stock = require('../models/Stock/stock');
// const PurchaseTransaction = require('../models/Stock/purchaseTransaction');
// const CustomerPhone = require('../models/Customer/customerPhone');

// // BULK CREATE
const userData = require('./dataSource/user.json');

const brandData = require('./dataSource/products/brandFirst.json');
const categoryData = require('./dataSource/products/categoryFirst.json');
const subCategoryData = require('./dataSource/products/subCategory.json');
const hsnData = require('./dataSource/products/hsn.json');
const gstData = require('./dataSource/products/gst.json');
const locationData = require('./dataSource/products/location.json');
const productData = require('./dataSource/products/productsOachiraFirst.json');

const vehicleTypeData = require('./dataSource/vehicleType.json');
const branchData = require('./dataSource/branch.json');
const vehilceData = require('./dataSource/vehicle.json');
const bankAccountData = require('./dataSource/bankAccount.json');


async function syncModel(){

    //USER
    Role.hasMany(User,{foreignKey : 'roleId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    User.belongsTo(Role)

    //PRODUCT
    
    PrimaryUnit.hasMany(SecondaryUnit,{foreignKey : 'primaryUnitId',  onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    SecondaryUnit.belongsTo(PrimaryUnit)

    Category.hasMany(SubCategory,{foreignKey : 'categoryId',  onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    SubCategory.belongsTo(Category)
    
    Category.hasMany(Product,{foreignKey : 'categoryId',  onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Product.belongsTo(Category)

    SubCategory.hasMany(Product,{foreignKey : 'subCategoryId',  onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Product.belongsTo(SubCategory)
    
    Brand.hasMany(Product,{foreignKey : 'brandId', onDelete : 'CASCADE', onUpdate : 'CASCADE'}) 
    Product.belongsTo(Brand)
    
    Location.hasMany(Product,{foreignKey : 'locationId',  onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Product.belongsTo(Location)

    Gst.hasMany(Product,{foreignKey : 'gstId',  onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Product.belongsTo(Gst)

    Hsn.hasMany(Product,{foreignKey : 'hsnId',  onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Product.belongsTo(Hsn)

    Product.hasMany(ProductDistributor,{foreignKey : 'productId',  onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    ProductDistributor.belongsTo(Product)

    Distributor.hasMany(ProductDistributor,{foreignKey : 'distributorId',  onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    ProductDistributor.belongsTo(Distributor)

    // STORE
    User.hasMany(Store,{foreignKey : 'storeInChargeId', as: 'storeInCharge',  onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Store.belongsTo(User, {foreignKey : 'storeInChargeId', as: 'storeInCharge'})
    // CustomerGrade.hasMany(Customer, {foreignKey : 'customerGradeId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // Customer.belongsTo(CustomerGrade)

    // CustomerCategory.hasMany(Customer, {foreignKey : 'customerCategoryId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // Customer.belongsTo(CustomerCategory)

    // Customer.hasMany(CustomerPhone, {foreignKey : 'customerId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // CustomerPhone.belongsTo(Customer)

   
  
    // // BRANCH
    // Branch.hasMany(User,{foreignKey : 'branchId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // User.belongsTo(Branch)

    // Branch.hasMany(Customer,{foreignKey : 'branchId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // Customer.belongsTo(Branch)

    // Branch.hasMany(Vehicle,{foreignKey : 'branchId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // Vehicle.belongsTo(Branch)

    // Branch.hasMany(Route,{foreignKey : 'branchId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // Route.belongsTo(Branch)

    // Branch.hasMany(Trip,{foreignKey : 'branchId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // Trip.belongsTo(Branch)

    // VehicleType.hasMany(Vehicle, {foreignKey : 'vehicleTypeId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // Vehicle.belongsTo(VehicleType)

    // // User.hasMany(Branch,{foreignKey : 'branchManagerId', onDelete : 'CASCADE', onUpdate : 'CASCADE'}) 
    // // Branch.belongsTo(User, {as: 'branchManager', foreignKey : 'branchManagerId'})

    // BankAccount.hasMany(BranchAccount,{foreignKey : 'bankAccountId', onDelete : 'CASCADE', onUpdate : 'CASCADE'}) 
    // BranchAccount.belongsTo(BankAccount)

    // Branch.hasMany(BranchAccount,{foreignKey : 'branchId', onDelete : 'CASCADE', onUpdate : 'CASCADE'}) 
    // BranchAccount.belongsTo(Branch)

    // //ROUTE
    // Vehicle.hasMany(Route, {foreignKey : 'vehicleId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // Route.belongsTo(Vehicle)

    // User.hasOne(Route,{foreignKey : 'driverId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // Route.belongsTo(User, {as: 'driver', foreignKey : 'driverId'})

    // User.hasOne(Route, {foreignKey : 'salesManId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // Route.belongsTo(User, {as:'salesman', foreignKey : 'salesManId'})

    // User.hasOne(Route, {foreignKey : 'salesExecutiveId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // Route.belongsTo(User, {as:'salesexecutive', foreignKey : 'salesExecutiveId'})

    // Route.hasMany(CollectionDays, {foreignKey : 'routeId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // CollectionDays.belongsTo(Route)

    // Route.hasMany(RouteDetails, {foreignKey : 'routeId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // RouteDetails.belongsTo(Route)

    // Customer.hasMany(RouteDetails, {foreignKey : 'customerId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // RouteDetails.belongsTo(Customer)

    // //SALES EXECUTIVE
    // Route.hasOne(PickList, {foreignKey : 'routeId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // PickList.belongsTo(Route)

    // Customer.hasOne(PickList, {foreignKey : 'customerId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // PickList.belongsTo(Customer)

    // User.hasOne(PickList, {foreignKey : 'salesExecutiveId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // PickList.belongsTo(User, {as:'salesexecutive', foreignKey : 'salesExecutiveId'})

    // Product.hasOne(PickListDetails, {foreignKey : 'productId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // PickListDetails.belongsTo(Product)

    // PickList.hasOne(PickListDetails, {foreignKey : 'pickListId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // PickListDetails.belongsTo(PickList)

    // Route.hasOne(DailyCollection, {foreignKey : 'routeId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // DailyCollection.belongsTo(Route)

    // Customer.hasOne(DailyCollection, {foreignKey : 'customerId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // DailyCollection.belongsTo(Customer)

    // User.hasOne(DailyCollection, {foreignKey : 'salesExecutiveId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // DailyCollection.belongsTo(User, {as:'salesexecutive', foreignKey : 'salesExecutiveId'})

    // Route.hasOne(Trip, {foreignKey : 'routeId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // Trip.belongsTo(Route)

    // Trip.hasOne(TripDetails, {foreignKey : 'tripId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // TripDetails.belongsTo(Trip)

    // Customer.hasOne(TripDetails, {foreignKey : 'customerId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // TripDetails.belongsTo(Customer)

    // Route.hasMany(DeliveryDays, {foreignKey : 'routeId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // DeliveryDays.belongsTo(Route)

    // //PURCHASES
    // Vendor.hasMany(PurchaseOrder,{foreignKey : 'vendorId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // PurchaseOrder.belongsTo(Vendor)

    // User.hasMany(PurchaseOrder,{foreignKey : 'userId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // PurchaseOrder.belongsTo(User)

    // Branch.hasMany(PurchaseOrder,{foreignKey : 'branchId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // PurchaseOrder.belongsTo(Branch)

    // Product.hasMany(PurchaseOrderDetails, {foreignKey : 'productId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // PurchaseOrderDetails.belongsTo(Product)

    // PurchaseOrder.hasMany(PurchaseOrderDetails,{foreignKey : 'purchaseOrderId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // PurchaseOrderDetails.belongsTo(PurchaseOrder)

    // PurchaseOrder.hasOne(PurchaseEntry, {foreignKey : 'purchaseOrderId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // PurchaseEntry.belongsTo(PurchaseOrder)

    // Vendor.hasMany(PurchaseEntry,{foreignKey : 'vendorId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // PurchaseEntry.belongsTo(Vendor)

    // User.hasMany(PurchaseEntry,{foreignKey : 'userId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // PurchaseEntry.belongsTo(User)

    // Branch.hasMany(PurchaseEntry,{foreignKey : 'branchId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // PurchaseEntry.belongsTo(Branch)

    // Product.hasMany(PurchaseEntryDetails, {foreignKey : 'productId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // PurchaseEntryDetails.belongsTo(Product)

    // PurchaseEntry.hasMany(PurchaseEntryDetails,{foreignKey : 'purchaseEntryId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // PurchaseEntryDetails.belongsTo(PurchaseEntry)

    // SecondaryUnit.hasMany(PurchaseEntryDetails, {foreignKey : 'secondaryUnitId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // PurchaseEntryDetails.belongsTo(SecondaryUnit)

    // Gst.hasMany(PurchaseEntryDetails, {foreignKey : 'gstId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // PurchaseEntryDetails.belongsTo(Gst)


    // // STOCK
    // Product.hasMany(Stock,{foreignKey : 'productId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // Stock.belongsTo(Product)

    // Stock.hasMany(PurchaseTransaction,{foreignKey: 'stockId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // PurchaseTransaction.belongsTo(Stock)

    // PurchaseEntry.hasMany(PurchaseTransaction,{foreignKey: 'purchaseEntryId', onDelete : 'CASCADE'})
    // PurchaseTransaction.belongsTo(PurchaseEntry)

    await sequelize.sync({alter: true})

    const role = await Role.findAll({})
    if(role.length === 0){
        Role.bulkCreate([
            {roleName : 'Admin', status: true},
            {roleName : 'Counter', status: true},
            {roleName : 'Salesman', status: true},
            {roleName : 'Driver', status: true},
            {roleName : 'SalesExecutive', status: true},
            {roleName : 'BranchManager', status: true}
        ])
    }

    const user = await User.findAll({})
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt)
    if(user.length === 0){
        for(let i = 0; i < userData.length; i++){
            const name = userData[i].phoneNumber;
            userData[i].password = hashedPassword
            userData[i].userName = name
            
            User.bulkCreate([userData[i]])
        }
    }

    const pUnit = await PrimaryUnit.findAll({})
    if(pUnit.length === 0){
        PrimaryUnit.bulkCreate([
            {primaryUnitName : 'Nos', factor : 1},
            {primaryUnitName : 'KG', factor : 1},
            {primaryUnitName : 'Litre', factor : 1},
            {primaryUnitName : 'Meter', factor : 1},
            {primaryUnitName : 'Gram', factor : 1},
        ])
    }
 
    const brand = await Brand.findAll({})
    if(brand.length == 0){
        for(let i = 0; i < brandData.length; i++){
            Brand.bulkCreate([brandData[i]])
        }
    }

    const category = await Category.findAll({})
    if(category.length == 0) {
        for(let i = 0; i < categoryData.length; i++){
            Category.bulkCreate([categoryData[i]])
        }
    }

    const subCategory = await SubCategory.findAll({})
    if(subCategory.length == 0) {
        for(let i = 0; i < subCategoryData.length; i++){
            SubCategory.bulkCreate([subCategoryData[i]])
        }
    }

    const gst = await Gst.findAll({})
    if(gst.length == 0){
        for(let i = 0; i < gstData.length; i++){
            Gst.bulkCreate([gstData[i]])
        }
    }

    const hsn = await Hsn.findAll({})
    if(hsn.length == 0){
        for(let i = 0; i < hsnData.length; i++){
            Hsn.bulkCreate([hsnData[i]])
        }
    }

    const location = await Location.findAll({})
    if(location.length == 0){
        for(let i = 0; i < locationData.length; i++){
            Location.bulkCreate([locationData[i]])
        }
    }

    const product = await Product.findAll({})
    if (product.length === 0) {
        for(let i = 0; i < productData.length; i++){
            Product.bulkCreate([productData[i]])
        }
    }

    // const customerCategory = await CustomerCategory.findAll({})
    // if(customerCategory.length === 0){
    //     CustomerCategory.bulkCreate([
    //        {categoryName : 'Walkin'},
    //        {categoryName : 'Wholesale'},
    //        {categoryName : 'Route'},
    //        {categoryName : 'Ecommerce'},
    //     ])
    // }

    // const customerGarde = await CustomerGrade.findAll({})
    // if(customerGarde.length === 0){
    //     CustomerGrade.bulkCreate([
    //         {grade : 'Normal', gradeRemarks : 'initial customer'}, // initial customer
    //         {grade : 'Regular', gradeRemarks : 'min 25 transactions'}, // min 25 transactions
    //         {grade : 'Premium', gradeRemarks : '50 transactions'}, // 50 transactions
    //         {grade : 'VIP', gradeRemarks : '100 transactions'}, // 100 transactions
    //         {id : 100, grade : 'Fraud', gradeRemarks : 'bad debtors'}// bad debtors
    //     ])
    // }
    

    // const vehicleType = await VehicleType.findAll({})
    // if(vehicleType.length === 0){
    //     for(let i = 0; i < vehicleTypeData.length; i++){
    //         VehicleType.bulkCreate([vehicleTypeData[i]])
    //     }
    // }

    // const vehicle = await Vehicle.findAll({})
    // if(vehicle.length === 0){
    //     for(let i = 0; i < vehilceData.length; i++){
    //         Vehicle.bulkCreate([vehilceData[i]])
    //     }
    // }

    // const bankAccount = await BankAccount.findAll({})
    // if(bankAccount.length === 0){
    //     for(let i = 0; i < bankAccountData.length; i++){
    //         BankAccount.bulkCreate([bankAccountData[i]])
    //     }
    // }
}



module.exports = syncModel