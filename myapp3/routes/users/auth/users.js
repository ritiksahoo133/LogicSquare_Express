var express = require("express");
var router = express.Router();
const User = require("../../../models/users");
const Message = require("../../../models/message");
var { expressjwt } = require("express-jwt"); //express-jwt
const authJwtMiddleware = require("../../../middleware/authmiddlewire");

const checkJwt = expressjwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
});

module.exports = {
  // register
  async create(req, res) {
    try {
      const { username, email, password, imageUrl } = req.body;
      const checkUser = await User.countDocuments({
        email: email.toLowerCase(),
      }).exec();
      if (checkUser > 0) {
        throw new Error("Email already exists");
      }
      const response = await User.create({
        username: username,
        password: password,
        email: email,
        imageUrl: imageUrl,
      });

      return res.status(200).json({ response, error: false });
    } catch (error) {
      console.log("error-->", error);

      return res.status(500).json({ error: error.message });
    }
  },

  // get all users
  async getAllUser(req, res) {
    try {
      let response = await User.find().select("-password -_id");
      console.log(response);

      if (!response || response.length === 0)
        return res.status(400).json({ error: true, reason: "user not found" });

      return res.status(200).json({ response, error: false });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  //get user
  async getUser(req, res) {
    try {
      const userId = req.user._id;
      let response = await User.findOne({ _id: userId }).select("-password");

      if (response === null)
        return res.status(400).json({ error: true, reason: "user not found" });

      return res.status(200).json({ response, error: false });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // edit profile
  async editProfile(req, res) {
    try {
      const { username, email, imageUrl } = req.body;
      const userId = req.user._id;
      const user = await User.findOne({ _id: userId });
      if (user === null)
        return res.status(400).json({ error: true, reason: "user not found" });

      if (username) user.username = username;
      if (email) user.email = email;
      if (imageUrl) user.imageUrl = imageUrl;

      user.save();
      return res.status(200).json({ error: false, user });
    } catch (error) {
      return res.status(500).json({ error: true, reason: error.message });
    }
  },
};

router.put("/editprofile", authJwtMiddleware, async (req, res) => {
  try {
    const { username, email, imageUrl } = req.body;
    const userId = req.user._id;
    const user = await User.findOne({ _id: userId });
    if (user === null)
      return res.status(400).json({ error: true, reason: "user not found" });

    if (username) user.username = username;
    if (email) user.email = email;
    if (imageUrl) user.imageUrl = imageUrl;

    user.save();
    return res.status(200).json({ error: false, user });
  } catch (error) {
    return res.status(500).json({ error: true, reason: error.message });
  }
});
// module.exports = router;
