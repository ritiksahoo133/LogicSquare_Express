const mongoose = require("mongoose");

const url = "mongodb://127.0.0.1:27017/mydatabase";

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
