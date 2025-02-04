const express = require("exporess");
const searchRouter = express.Router();
const {searchProduct} = require("./../controllers/productSearch");

// General search
searchRouter.get('/:searchName', searchProduct);
