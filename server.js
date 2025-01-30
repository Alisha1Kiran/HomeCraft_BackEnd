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

server.use(cors());

// Important to handle incoming JSON
server.use(express.json());
server.use(cookieParser());

server.use("/api", apiRouter);

server.listen(port, () => {
  console.log(`App running at port ${port}`);
});
