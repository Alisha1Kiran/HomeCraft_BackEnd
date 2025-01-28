const Reviews = require("./../models/ReviewsModel");
const Products = require("./../models/ProductModel");
const User = require("./../models/UserModel");
const {sendSuccess, sendError} = require("./../utils/apiUtils")

const postProductReview = async (req, res) => {
    try {
        const {product_id, comment, rating } = req.body;

        console.log("req.user ", req.user);
        const user_id = req.user?.id; // Assuming req.user is populated by middleware
        if (!user_id) return sendError(res, 401, 'Unauthorized user');

        // Check if the product exists
        const product = await Products.findById(product_id);
        if (!product) return sendError(res, 404, 'Product not found');

        const existingReview = await Reviews.findOne({ user_id, product_id });
        if (existingReview)
            return sendError(res, 400, 'You have already reviewed this product');

        // Create the review
        const review = new Reviews({ user_id, product_id, comment, rating });
        await review.save();

        sendSuccess(res, 201, 'Review created successfully', review);
    } catch (error) {
        sendError(res, 500, `Error creating review : ${error}`);
    }
};

// Get all reviews for a product
const fetchProductReview = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await Reviews.find({ product_id: productId }).populate('user_id', 'name'); // Populating user details

        if (!reviews.length) {
            return sendError(res, 404, 'No reviews found for this product');
        }

        sendSuccess(res, 200, 'Reviews fetched successfully', reviews);
    } catch (error) {
        sendError(res, 500, `Error : ${error} `);
    }
}

// Fetch all reviews of a user
const fetchUserReview = async (req, res) => {
    try {
        const { userId } = req.params;

        const reviews = await Reviews.find({ user_id: userId }).populate('product_id', 'name'); // Populating product details

        if (!reviews.length) {
            return sendError(res, 404, 'No reviews found for this user');
        }

        sendSuccess(res, 200, 'Reviews fetched successfully', reviews);
    } catch (error) {
        sendError(res, 500, `Error : ${error}`);
    }
}

// update a review
const updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { comment, rating } = req.body;

        const review = await Reviews.findById(reviewId);

        if (!review) return sendError(res, 404, 'Review not found');

        // Update the fields
        if (comment) review.comment = comment;
        if (rating) review.rating = rating;

        await review.save();
        sendSuccess(res, 200, 'Review updated successfully', review);
    } catch (error) {
        sendError(res, 500, `Error : ${error}`);
    }
};

// Delete a review
const deleteProductReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const review = await Reviews.findByIdAndDelete(reviewId);

        if (!review) return sendError(res, 404, 'Review not found');

        sendSuccess(res, 200, 'Review deleted successfully');
    } catch (error) {
        sendError(res, 500, `Error : ${error}`);
    }
}

module.exports = {postProductReview, fetchProductReview, fetchUserReview, updateReview, deleteProductReview}
