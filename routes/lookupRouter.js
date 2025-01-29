const express = require("express")
const lookupRouter = express.Router();
const {getCategory, getSubCategory, getBedSize, mattressType, seatingSize, wardrobeDoorCount, purposeFor} = require("./../controllers/lookupController");

lookupRouter.get("/fetch-categories", getCategory);

lookupRouter.get("/fetch-subCategories/:categoryId", getSubCategory);

lookupRouter.get("/fetch-bedSize", getBedSize);

lookupRouter.get("/fetch-mattressType", mattressType);

lookupRouter.get("/fetch-seatingSize", seatingSize);

lookupRouter.get("/fetch-wardrobeDoorCount", wardrobeDoorCount);

lookupRouter.get("/fetch-purposeFor", purposeFor);

module.exports = lookupRouter;