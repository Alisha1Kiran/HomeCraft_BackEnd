const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const statisticsRouter = express.Router();
const {getSalesTrend, getUserGrowth} = require("./../controllers/statisticsController");

statisticsRouter.get('/sales-trend', verifyToken, getSalesTrend);
statisticsRouter.get('/user-growth', verifyToken, getUserGrowth);

module.exports = statisticsRouter;