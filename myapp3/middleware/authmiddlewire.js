const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const authJwtMiddleware = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json({ error: "unauthorized" });

  try {
    //verify
    const decoded = jwt.verify(token, process.env.SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authJwtMiddleware;
