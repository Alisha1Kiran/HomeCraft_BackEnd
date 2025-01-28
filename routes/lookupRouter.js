const express = require("express")
const lookupRouter = express.Router();
const {getCategory, getSubCategory, getBedSize, mattressType} = require("./../controllers/lookupController");

lookupRouter.get("/fetch-categories", getCategory);

lookupRouter.get("/fetch-subCategories/:categoryId", getSubCategory);

lookupRouter.get("/fetch-bedSize", getBedSize);

lookupRouter.get("/fetch-mattressType", mattressType);

module.exports = lookupRouter;