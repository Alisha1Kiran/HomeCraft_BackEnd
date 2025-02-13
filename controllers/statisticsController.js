const Orders = require('../models/OrderModel');
const User = require("./../models/UserModel");

const getSalesTrend = async (req, res) => {
    try {
        if(!req.user.role == "admin") return sendError(res, "Not an authorized user to perform this action");
      // Aggregate sales data by month
      const salesData = await Orders.aggregate([
        {
          $group: {
            _id: { $month: "$createdAt" }, // Group by month
            totalSales: { $sum: "$totalAmount" }, // Sum the total sales
          },
        },
        { $sort: { _id: 1 } }, // Sort by month in ascending order
      ]);
  
      // Format the data to return month names and sales amounts
      const formattedSalesData = salesData.map(item => ({
        month: new Date(0, item._id - 1).toLocaleString('en', { month: 'long' }), // Get month name
        sales: item.totalSales,
      }));
  
      res.json({
        success: true,
        message: 'Sales trends retrieved successfully',
        data: formattedSalesData,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch sales trends',
      });
    }
  };

  const getUserGrowth = async (req, res) => {
    if(!req.user.role == "admin") return sendError(res, "Not an authorized user to perform this action");
    try {
      // Aggregate user registration data by month
      const userGrowthData = await User.aggregate([
        {
          $group: {
            _id: { $month: "$createdAt" }, // Group by month
            newUsers: { $sum: 1 }, // Count the number of users in each month
          },
        },
        { $sort: { _id: 1 } }, // Sort by month in ascending order
      ]);
  
      // Format the data to return month names and new user counts
      const formattedUserGrowthData = userGrowthData.map(item => ({
        month: new Date(0, item._id - 1).toLocaleString('en', { month: 'long' }), // Get month name
        newUsers: item.newUsers,
      }));
  
      res.json({
        success: true,
        message: 'User growth data retrieved successfully',
        data: formattedUserGrowthData,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: `Failed to fetch user growth data : ${error}`,
      });
    }
  };

  module.exports = {getSalesTrend, getUserGrowth}