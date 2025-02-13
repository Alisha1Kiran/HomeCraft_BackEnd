const express = require("express");
const productsRouter = express.Router();
const {
  createProduct,
  getAllProducts,
  getTotalProduct,
  getProductById,
  getProductByName,
  updateProduct,
  deleteProduct,
} = require("./../controllers/productsController");
const verifyToken = require("./../middlewares/verifyToken");
const {searchProduct} = require("./../controllers/productSearch");

productsRouter.post("/addProducts", verifyToken, createProduct);

productsRouter.get("/viewAllProducts", getAllProducts);

productsRouter.get("/totalProduct", getTotalProduct);

productsRouter.get("/viewProductDetails/:id", getProductById);

productsRouter.get("/viewProduct/:productName", getProductByName);

productsRouter.put("/editProductDetails/:id", verifyToken, updateProduct);

productsRouter.delete("/deleteProduct/:id", verifyToken, deleteProduct);

module.exports = productsRouter;
