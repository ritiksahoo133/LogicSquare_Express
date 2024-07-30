const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log("Hello");
  res.render("newPage");
});

module.exports = router;
