const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../../models/users");
const bcrypt = require("bcrypt");
require("dotenv").config();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === undefined || password === undefined)
      return res.status(400).json({
        error: true,
        reason: "email and password field are mandatory",
      });

    const checkValid = new User({ email: email, password: password });
    await checkValid.validate();

    const user = await User.findOne({ email: checkValid.email });

    if (user === null) throw new Error("Invalid username or password");

    //check password
    await user.comparePassword(password);

    user.lastLoggedInDate = new Date();
    await user.validate();
    await user.save();

    const payload = {
      _id: user._id,
      email: user.email,
    };
    const token = jwt.sign(
      payload,
      process.env.SECRET,
      {
        expiresIn: 3600 * 24 * 30,
      },
      { algorithm: "RS256" }
    );
    return res
      .status(200)
      .json({ error: false, message: "Login successful", token });
  } catch (error) {
    return res.status(500).json({ error: true, reason: error.message });
  }
});

module.exports = router;
