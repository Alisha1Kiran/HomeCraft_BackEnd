const express = require("express");
const searchRouter = express.Router();
const {searchProduct} = require("./../controllers/productSearch");

// General search
searchRouter.get('/:searchName', searchProduct);

module.exports = searchRouter;
