const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const filepath = path.join(__dirname, "public", "/images/4.png");

  res.download(filepath, (err) => {
    if (err) {
      console.error("Error sending file", err);
      res.status(500).send("Error sending file");
    }
  });
});

router.get("/chat", (req, res) => {
  res.redirect(302, "/chat");
});
module.exports = router;
