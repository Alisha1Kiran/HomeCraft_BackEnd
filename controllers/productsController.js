const Product = require("./../models/ProductModel");
const {sendSuccess, sendError} = require("./../utils/apiUtils");

// create product
const createProduct = async (req, res) => {
    if(!req.user.role == "admin") return sendError(res, "Not an authorized user to perform this action");

    const { name, description, price, category_id, subcategory_id,purposeFor_id, specifications, stock, images } = req.body;

    if(!name || !price || !category_id || purposeFor_id || !stock)
        return sendError(res, 400, "Name, Price, Category, Purpose for and Stock are manditory");

    try {
        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
        return sendError(res, 409, 'Product with this name already exists.');
        }

        const newProduct = new Product({
            name,
            description,
            price,
            category_id,
            subcategory_id,
            purposeFor_id,
            bedSize_id,
            seatingSize_id,
            doorCout_id,
            specifications,
            stock,
            images
          });

          await newProduct.save();
        sendSuccess(res, 201, 'Product created successfully', newProduct);
        
    } catch (error) {
        sendError(res, 500, `Error creating product: ${error.message}`);
    }
};

// Fetch all products
const getAllProducts = async (req, res) => {
    try {
      const products = await Product.find();
      // Get the total count of products
      const totalCount = await Product.countDocuments();

      if (products.length === 0) {
        return sendError(res, 404, 'No products found.');
      }
      sendSuccess(res, 200, 'Products retrieved successfully', {
            totalCount,
            products
        });
    } catch (error) {
      sendError(res, 500, `Error fetching products: ${error.message}`);
    }
};

// get product by id
const getProductById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const product = await Product.findById(id);
      if (!product) {
        return sendError(res, 404, 'Product not found.');
      }
      sendSuccess(res, 200, 'Product details retrieved successfully', product);
    } catch (error) {
      sendError(res, 500, `Error fetching product: ${error.message}`);
    }
};

// Update product data
const updateProduct = async (req, res) => {
    if(!req.user || req.user.role !== "admin") return sendError(res, "Not an authorized user to perform this action");

    const { id } = req.params;
    const updates = req.body;

    console.log("updates : ", updates);
  
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
      if (!updatedProduct) {
        return sendError(res, 404, 'Product not found.');
      }
      sendSuccess(res, 200, 'Product updated successfully', updatedProduct);
    } catch (error) {
      sendError(res, 500, `Error updating product: ${error.message}`);
    }
};

// delete product
const deleteProduct = async (req, res) => {
    if(!req.user || req.user.role !== "admin") return sendError(res, "Not an authorized user to perform this action");

    const { id } = req.params;
  
    try {
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        return sendError(res, 404, 'Product not found.');
      }
      sendSuccess(res, 200, 'Product deleted successfully');
    } catch (error) {
      sendError(res, 500, `Error deleting product: ${error.message}`);
    }
};

module.exports = {createProduct, getAllProducts, getProductById, updateProduct, deleteProduct}
