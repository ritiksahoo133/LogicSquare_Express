var express = require("express");
var router = express.Router();

router.get("/tictoctoe", (req, res) => {
  console.log("Hello");
  res.render("tic_toc_toe");
});
router.get("/head_rotate", (req, res) => {
  console.log("Hello");
  res.render("head_rotate");
});
router.get("/swapcolor", (req, res) => {
  console.log("Hello");
  res.render("swap_color");
});
router.get("/traffic", (req, res) => {
  console.log("Hello");
  res.render("traffic");
});

module.exports = router;
