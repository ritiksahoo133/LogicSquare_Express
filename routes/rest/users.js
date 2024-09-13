const User = require("../../models/user");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const email = require("../../lib/mail");
const Email = require("email-templates");
const password = require("./auth/password");
// const twilioFun = require("../../lib/twilio");
const stripe = require("stripe")(
  "sk_test_51Pt2xx1xyS6eHcGHSrfLdSfyQQESKMatwXTA28TYmUMCXpnI2zjv1auMtdIZSyV771lqArWjZlXzFXE9yt87mbdS00ypiNeR0x"
);
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_AUTH_USER,
    pass: process.env.SMTP_AUTH_PASSWORD,
  },
});

// const email = new Email({
//   message: {
//     from: process.env.SMTP_AUTH_USER,
//   },
//   transport: {
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     secure: true, // use SSL
//     auth: {
//       user: process.env.SMTP_AUTH_USER,
//       pass: process.env.SMTP_AUTH_PASSWORD,
//     },
//   },
//   views: {
//     root: path.resolve("./emails"),
//     options: {
//       extension: "ejs",
//     },
//   },
// });
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

  // googleLink: `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`

  async googleLogin(req, res) {
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

  // Links:`https://graph.facebook.com/me?fields=id,name,email,gender,birthday,first_name&access_token=${token}`

  async facebookLogin(req, res) {
    const { token } = req.body;
    if (token === undefined) throw new Error("Missing token");
    try {
      const response = await axios.get(
        `https://graph.facebook.com/me?fields=id,name,email,gender,birthday,first_name&access_token=${token}`
      );
      console.log("response---->", response.data);

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
        gender: response.data.gender,
        birthday: response.data.birthday,
        first_name: response.data.first_name,
      };

      const jwttoken = jwt.sign(payload, process.env.SECRET, {
        expiresIn: 3600 * 24 * 30,
      });
      return res.status(200).json({
        error: false,
        token: jwttoken,
        handle: user.email,
      });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  async datedemo(req, res) {
    // format Dates
    const date = moment().format("MMMM Do YYYY,h:mm:ss a");
    const day = moment().format("dddd");
    const date2 = moment().format("MMM Do YY");
    const Isoformat = moment().format();
    // relative Time
    const Ago = moment("2001", "yyyy").fromNow();
    const endDayFromNow = moment().endOf("day").fromNow();
    const startDayFromNow = moment().startOf("day").fromNow();
    const add10days = moment().startOf("hour").fromNow();

    // calendar Time
    const subtract10DaysFromNow = moment().subtract(10, "days").calendar();
    const datenow = moment();
    var day2 = moment("1995-12-25");
    console.log("date------>", day2);

    return res.status(200).json({
      Date: date,
      Day: day,
      Date2: date2,
      ISOFORMAT: Isoformat,
      ago: Ago,
      startday: startDayFromNow,
      endday: endDayFromNow,
      adddays: add10days,
      subtract10daysfromnow: subtract10DaysFromNow,
    });
  },
  async moment(req, res) {
    const date = moment("03-04-2024", "DD-MM-YYYY").format("llll");
    const date2 = moment("2012 July", "YYYY MMM", "en").isValid();
    const date3 = moment("2010 2 30", "YYYY MM DD").isValid();
    const hour_min = moment("1234", "hmm").format("HH:mm");
    const multipleFormat = moment("12-25-1995", ["MM-DD-YYYY", "YYYY-MM-DD"]);
    return res.status(200).json({
      Date: date,
      Date2: date2,
      Date3: date3,
      Hourmin: hour_min,
      MultipleFormat: multipleFormat,
    });
  },
  async pushnotification(req, res) {
    return res.render("onesignal");
  },

  async sendnotification(req, res) {
    const { title, message, subscriptionId } = req.body;

    const notification = {
      app_id: process.env.ONESIGNAL_APPID,
      include_player_ids: [subscriptionId],
      headings: { en: title },
      contents: { en: message },
    };
    try {
      const response = await axios.post(
        "https://onesignal.com/api/v1/notifications",
        notification,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}`,
          },
        }
      );

      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async viewnotification(req, res) {
    const { notificationId } = req.body;
    try {
      const response = await axios.get(
        `https://api.onesignal.com/notifications/${notificationId}?app_id=${process.env.ONESIGNAL_APPID}`,
        {
          headers: {
            Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      return res.status(200).json({
        Headings: response.data.headings,
        Contents: response.data.contents,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async viewnotifications(req, res) {
    // const { notificationId } = req.body;
    try {
      const response = await axios.get(
        `https://api.onesignal.com/notifications?app_id=${process.env.ONESIGNAL_APPID}`,
        {
          headers: {
            Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      return res.status(200).json({
        Headings: response.data.headings,
        Contents: response.data.contents,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async sendemail(req, res) {
    const { to, subject, userName } = req.body;

    try {
      const templatePath = path.join(
        "E:",
        "Ritik",
        "Ls_Express",
        "skeleton",
        "views",
        "welcomemessage.ejs"
      );
      const html = await ejs.renderFile(
        templatePath,
        { userName },
        {
          async: true,
        }
      );

      const info = await transporter.sendMail({
        from: "User <ritikk@logic-square.com>",
        to,
        subject,

        html,
      });
      console.log("Info:", info);

      return res.status(200).json(info.messageId);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async demoEmail(req, res) {
    try {
      const info = await email("welcome", {
        to: "ritiksahoo133@gmail.com",
        subject: "Demo Email",
        from: "ritikk@logic-square.com",
        locals: {
          name: "Ritik",
          email: "ritiksahoo133@gmail.com",
          password: "password",
        },
        send: true,
      });
      return res.status(200).json(info);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // sendsms(req, res) {
  //   const { from, body, to } = req.body;
  //   try {
  //     const response = twilioFun(from, body, to);
  //     return res.status(200).json(response);
  //   } catch (error) {
  //     return res.status(500).json({ error: error.message });
  //   }
  // },
};
