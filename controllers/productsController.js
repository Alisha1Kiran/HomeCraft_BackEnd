const Product = require("./../models/ProductModel");
const {sendSuccess, sendError} = require("./../utils/apiUtils");

// create product
const createProduct = async (req, res) => {
    if(req.user.role !== "admin") return sendError(res, "Not an authorized user to perform this action");

    const { name, description, price, category_id,bedSize_id, seatingSize_id, doorCount_id, subcategory_id,purposeFor_id, specifications, stock, images } = req.body;

    if(!name || !price || !category_id || !purposeFor_id || !stock)
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
            bedSize_id: bedSize_id || null,  
    seatingSize_id: seatingSize_id || null,  
    doorCount_id: doorCount_id || null, 
            specifications,
            stock,
            images
          });

          await newProduct.save();

          // Populate the referenced fields
        const populatedProduct = await Product.findById(newProduct._id)
        .populate("category_id")
        .populate("subcategory_id")
        .populate("purposeFor_id")
        .populate("bedSize_id")
        .populate("seatingSize_id")
        .populate("doorCount_id");

        sendSuccess(res, 201, 'Product created successfully', populatedProduct);
        
    } catch (error) {
        sendError(res, 500, `Error creating product: ${error.message}`);
    }
};

// Fetch all products
// const getAllProducts = async (req, res) => {
//     try {
//       const products = await Product.find();
//       // Get the total count of products
//       const totalCount = await Product.countDocuments();

//       if (products.length === 0) {
//         return sendError(res, 404, 'No products found.');
//       }
//       sendSuccess(res, 200, 'Products retrieved successfully', {
//             totalCount,
//             products
//         });
//     } catch (error) {
//       sendError(res, 500, `Error fetching products: ${error.message}`);
//     }
// };

const getAllProducts = async (req, res) => {
  console.log("getAllProducts");
  try {
    let { page = 1, limit = 10, search = "", category = "" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    // Filter conditions
    let filter = {};
    if (search) {
      filter.name = { $regex: search, $options: "i" }; // Case-insensitive search
    }
    if (category) {
      filter.category_id = category;
    }

    // Count total products
    const totalProducts = await Product.countDocuments(filter);

    console.log("gvhbj: ", totalProducts)
    // Fetch products with population
    const products = await Product.find(filter)
      .populate("category_id")
      .populate("subcategory_id")
      .populate("purposeFor_id")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

      console.log(products);

    res.json({
      success: true,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

//get total product count
const getTotalProduct = async (req, res) => {
  try {
      const totalCount = await Product.countDocuments();
      sendSuccess(res, 200, 'Total product count retrieved successfully', { totalCount });
  } catch (error) {
      sendError(res, 500, `Error fetching product count: ${error.message}`);
  }
}

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

// Fetch product by name
const getProductByName = async (req, res) => {
  try {
    const productName = decodeURIComponent(req.params.productName);

    const product = await Product.findOne({ name: productName });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product found successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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

module.exports = {createProduct, getAllProducts, getTotalProduct, getProductById, getProductByName, updateProduct, deleteProduct}
