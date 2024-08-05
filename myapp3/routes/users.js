var express = require("express");
var router = express.Router();
const User = require("../models/users");
const Message = require("../models/message");

router.post("/createUser", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const response = await User.create({
      username: username,
      password: password,
      email: email,
      lastLoggedInDate: Date.now(),
    });

    return res.status(200).json({ response, error: false });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//get by ID
router.get("/getUser/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const response = await User.findOne({ _id: userId });

    return res.status(200).json({ response, error: false });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
