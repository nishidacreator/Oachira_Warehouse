
const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const syncModel = require('../utils/association');

const app = express();

app.use(cors({orgin:'*'}))

app.use(express.json());

syncModel()

const auth = require('../users/routers/auth');
const user = require('../users/routers/user');
const role = require('../users/routers/role');

app.use('/login', auth);
app.use('/register', user);
app.use('/role', role);

const product = require('../products/routers/product');
const category = require('../products/routers/category');
const brand = require('../products/routers/brand');
const hsn = require('../products/routers/hsn');
const location = require('../products/routers/location');
const primaryUnit = require('../products/routers/primaryUnit');
const secondaryUnit = require('../products/routers/secondaryUnit');
const subCategory = require('../products/routers/subCategory');
const gst = require('../products/routers/gst');

app.use('/product', product);
app.use('/category',category);
app.use('/brand',brand);
app.use('/hsn',hsn);
app.use('/location',location);
app.use('/primaryunit',primaryUnit);
app.use('/secondaryunit',secondaryUnit);
app.use('/subcategory',subCategory);
app.use('/gst',gst);


const port = process.env.PORT;

app.listen(port, () => {
    console.log(`server started on port ${port}`);
})
