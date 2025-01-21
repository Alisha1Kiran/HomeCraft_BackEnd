const express = require("express");
const mongoose = require("mongoose");
const apiRouter = require("./routes/apiRouter");
const cookieParser = require("cookie-parser");

const server = new express();
const port = 3000;
const mongooseUrl =
  "mongodb+srv://alishasatheesan1992:ivhJ8gcPQEqiEeNz@cluster0.3mrnn.mongodb.net/HomeCraftDB?retryWrites=true&w=majority&appName=HomeCraftCluster";

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

// Important to handle incoming JSON
server.use(express.json());
server.use(cookieParser());

server.use("/api", apiRouter);

server.listen(port, () => {
  console.log(`App running at port ${port}`);
});
