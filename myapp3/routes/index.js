var express = require("express");
var router = express.Router();

/* GET home page. */
// router.get("/:id", function (req, res, next) {
//   const email = req.params.id;
//   res.render("index", { title: "Express", email: email });
// });
router.get("/setCookie", (req, res) => {
  res.cookie("myCookie", "Hello", { httpOnly: true });
  res.send("Cookie has been set!");
});
router.post("/getCookie", (req, res) => {
  const cookieValue = req.cookies.myCookie;
  res.send(`Cookie value: ${cookieValue}`);
  res.send("Cookie has been set!");
});

module.exports = router;
