const express = require("express");
const mongoose = require("mongoose");
const apiRouter = require("./routes/apiRouter");
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();
const server = new express();
const port = process.env.PORT;
const mongooseUrl = process.env.MONGODB_URL;

server.get("/", (req, res) => {
  res.send("Hello!  Starting Home Craft !");
});

// MongoDB Connection
mongoose
  .connect(mongooseUrl)
  .then(() => {
    console.log("DB connected successfully");
  })
  .catch((err) => {
    console.error(`Mongo DB comnection error : ${err}`);
  });

const allowedOrigins = [
  "http://localhost:5173", // Local development
  "https://homecraft-backend.onrender.com", // backend production domain
];
// Use cors middleware
server.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

// Important to handle incoming JSON
server.use(express.json());
server.use(cookieParser());

server.use("/api", apiRouter);

server.listen(port, () => {
  console.log(`App running at port ${port}`);
});
