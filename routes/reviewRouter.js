const express = require("express");
const reviewRouter = express.Router();
const {postProductReview, fetchProductReview, fetchUserReview, updateReview, deleteProductReview} = require("./../controllers/reviewsController");
const verifyToken = require("../middlewares/verifyToken");

// Post review for a particular product
reviewRouter.post('/addReview', postProductReview);

// Get all reviews for a product
reviewRouter.get('/:productId', fetchProductReview);

// Get All Reviews by a User
reviewRouter.get('/getUserReview/:userId', fetchUserReview);

// update a review
reviewRouter.put('/updateReview/:reviewId', updateReview);

// Delete product review
reviewRouter.delete('/:reviewId', verifyToken, deleteProductReview);

module.exports = reviewRouter;