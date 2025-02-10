const  mongoose  = require("mongoose");
const User = require("./../models/UserModel");  
const {sendSuccess, sendError} = require("./../utils/apiUtils");

// Add product to wishlist
const addToWishlist = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.id; // Authenticated user's ID
  
    try {
      // Check if the product is already in the wishlist
      const user = await User.findById(req.user.id);
  
      if (!user) return sendError(res, 404, "User not found.");
  
      if (user.wishlist.includes(productId))
        return sendError(res, 400, "Product already in wishlist.");
  
      // Add product to wishlist
      user.wishlist.push(productId);
      await user.save();
  
      sendSuccess(res, 200, "Product added to wishlist", user.wishlist);
    } catch (error) {
      sendError(res, 500, `Failed to add to wishlist. Error: ${error.message}`);
    }
  };

  // Remove product from wishlist
const removeFromWishlist = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.id;
  
    try {
        const user = await User.findById(req.user.id);
  
      if (!user) return sendError(res, 404, "User not found.");
  
      // Remove product from wishlist
      user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
      await user.save();
  
      sendSuccess(res, 200, "Product removed from wishlist", user.wishlist);
    } catch (error) {
      sendError(res, 500, `Failed to remove from wishlist. Error: ${error.message}`);
    }
  };

  // Get user wishlist
  const getWishlist = async (req, res) => {
    const userId = req.user.id;

    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return sendError(res, 400, "Invalid user ID format.");
        }

        // Fetch user with wishlist populated
        const user = await User.findById(userId).populate("wishlist");

        if (!user) return sendError(res, 404, "User not found.");

        // Send the response with the populated wishlist
        sendSuccess(res, 200, "Wishlist retrieved successfully", user.wishlist);
    } catch (error) {
        sendError(res, 500, `Failed to fetch wishlist. Error: ${error.message}`);
    }
};



  module.exports = {addToWishlist, removeFromWishlist, getWishlist}