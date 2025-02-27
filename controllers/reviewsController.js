const Reviews = require("./../models/ReviewsModel");
const Product = require("./../models/ProductModel");
const User = require("./../models/UserModel");
const {sendSuccess, sendError} = require("./../utils/apiUtils")

const postProductReview = async (req, res) => {
    try {
        const { user_id, product_id, comment, rating, guestName } = req.body;
        // const user_id = req.user?.id; // Get user_id if logged in

        // Check if the product exists
        const product = await Product.findById(product_id);
        if (!product) return sendError(res, 404, 'Product not found');

        // If user is logged in, check if they have already reviewed
        if (user_id) {
            const existingReview = await Reviews.findOne({ user_id, product_id });
            if (existingReview) return sendError(res, 400, 'You have already reviewed this product');
        }

        // If guest, ensure they provided a name
        if (!user_id && !guestName) {
            guestName = "Guest";
            return sendError(res, 400, 'Guest name is required');
         
        }    

        // Create the review
        const review = new Reviews({ user_id, guestName, product_id, comment, rating });
        await review.save();

        // Recalculate and update product's average rating
        const reviews = await Reviews.find({ product_id });
        const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
        product.ratings = avgRating.toFixed(1); // Store rounded value
        await product.save();

        sendSuccess(res, 201, 'Review submitted successfully', review);
    } catch (error) {
        sendError(res, 500, `Error creating review: ${error}`);
    }
};

// Get all reviews for a product
const fetchProductReview = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await Reviews.find({ product_id: productId })
            .populate({ path: 'user_id', select: 'name', strictPopulate: false }) // Populate user details if available
            .lean(); // Convert mongoose object to plain JS object

        if (!reviews.length) return sendError(res, 404, 'No reviews found for this product');

        // Format response to include either user name or guest name
        const formattedReviews = reviews.map(review => ({
            ...review,
            reviewerName: review.user_id ? review.user_id.name : review.guestName
        }));

        sendSuccess(res, 200, 'Reviews fetched successfully', formattedReviews);
    } catch (error) {
        sendError(res, 500, `Error fetching reviews: ${error}`);
    }
};

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
        const user_id = req.user?.id;

        const review = await Reviews.findById(reviewId);
        if (!review) return sendError(res, 404, 'Review not found');

        // Prevent guests from deleting reviews
        if (!user_id) return sendError(res, 403, 'Only logged-in users can delete reviews');

        // Ensure only the review owner or an admin can delete
        if (review.user_id.toString() !== user_id && req.user.role !== 'admin') {
            return sendError(res, 403, 'Unauthorized');
        }

        await Reviews.findByIdAndDelete(reviewId);

        // Recalculate and update product's average rating
        const reviews = await Reviews.find({ product_id: review.product_id });
        const avgRating = reviews.length ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 0;
        await Product.findByIdAndUpdate(review.product_id, { ratings: avgRating });

        sendSuccess(res, 200, 'Review deleted successfully');
    } catch (error) {
        sendError(res, 500, `Error deleting review: ${error}`);
    }
};


module.exports = {postProductReview, fetchProductReview, fetchUserReview, updateReview, deleteProductReview}
