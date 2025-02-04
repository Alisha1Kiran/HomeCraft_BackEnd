const express = require("express");
const searchRouter = express.Router();
const {searchProduct} = require("./../controllers/productSearch");

// General search
searchRouter.get('/:searchTerm1/:searchTerm2?', searchProduct);

module.exports = searchRouter;
