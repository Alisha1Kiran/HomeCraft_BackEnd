const express = require("express");
const productsRouter = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("./../controllers/productsController");
const verifyToken = require("./../middlewares/verifyToken");

productsRouter.post("/addProducts", verifyToken, createProduct);

productsRouter.get("/viewAllProducts", getAllProducts);

productsRouter.get("/viewProductDetails/:id", getProductById);

productsRouter.put("/editProductDetails/:id", verifyToken, updateProduct);

productsRouter.delete("/deleteProduct/:id", verifyToken, deleteProduct);

module.exports = productsRouter;
