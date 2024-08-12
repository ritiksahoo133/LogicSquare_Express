const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.MONGODB_CONNECTION_STRING;

mongoose.connect(url);

const db = mongoose.connection;

db.on("connected", () => {
  console.log("Mongoose connected to database");
});

db.on("error", (err) => {
  console.log("Mongoose error: " + err);
});
db.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

module.exports = db;
