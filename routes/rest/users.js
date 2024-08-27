const User = require("../../models/user");
const axios = require("axios");
const jwt = require("jsonwebtoken");
module.exports = {
  /**
    *
    * @api {get} /user/:id get user details
    * @apiName userDetails
    * @apiGroup User
    * @apiVersion  1.0.0
    * @apiPermission User
    *
    * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
    *
    * @apiParam {String} id Users unique ID.
    *
    * @apiSuccess (200) {json} name description
    *
    * @apiSuccessExample {type} Success-Response:
      {
        "error" : false,
        "user" : {
          "email": "myEmail@logic-square.com",
          "phone": "00000000000",
          "name"  : {
            "first":"Jhon",
            "last" :"Doe"
          }
        }
      }
    *
    *
  */
  async get(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findOne({
        _id: id,
      })
        .select("-password -forgotpassword")
        .exec();
      if (user === null) throw new Error("No user found for the given id");
      return res.json({
        error: false,
        user,
      });
    } catch (err) {
      return res.status(500).json({
        error: true,
        reason: err.message,
      });
    }
  },

  async userinfo(req, res) {
    const { token } = req.params;
    if (token === undefined) throw new Error("Missing token");
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`
      );

      const user = await User.findOne({ email: response.data.email });
      if (user === null) {
        throw new Error("user not registered, please register first");
      }

      const payload = {
        id: user._id,
        _id: user._id,
        fullName: user.name.full,
        email: user.email,
        phone: user.phone,
      };
      const jwttoken = jwt.sign(payload, process.env.SECRET, {
        expiresIn: 3600 * 24 * 30,
      });
      return res.status(200).json({
        error: false,
        handle: user.email,
        token: jwttoken,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
