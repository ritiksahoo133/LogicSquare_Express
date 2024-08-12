const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const myLog = (req, res, next) => {
  let time = new Date(Date.now());
  req.requestTime = time.toLocaleString();
  console.log("requested Time", req.requestTime);
  next();
};

module.exports = myLog;
