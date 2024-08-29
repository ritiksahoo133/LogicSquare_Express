const express = require("express");
const router = express.Router();
const expressJwt = require("express-jwt");
const checkJwt = expressJwt({
  secret: process.env.SECRET,
  algorithms: ["RS256"],
}); // the JWT auth check middleware

const users = require("./users");
const login = require("./auth");
const signup = require("./auth/signup");
const forgotpassword = require("./auth/password");
const stripe = require("../../lib/stripe");

router.post("/login", login.post); // UNAUTHENTICATED
router.post("/signup", signup.post); // UNAUTHENTICATED
router.post("/forgotpassword", forgotpassword.startWorkflow); // UNAUTHENTICATED; AJAX
router.post("/resetpassword", forgotpassword.resetPassword); // UNAUTHENTICATED; AJAX
router.get("/gmaillogin/:token?", users.gmailLogin);
router.post("/facebooklogin", users.facebookLogin);
router.get("/demo", users.pushnotification);
router.post("/sendnotification", users.sendnotification);
router.get("/viewnotification", users.viewnotification);
router.get("/viewnotifications", users.viewnotifications);
router.post("/sendemail", users.sendemail);
router.post("/sendmsg", users.demoEmail);
router.post("/createprice", users.createPrice);
router.post("/createcustomer", stripe.createCustomer);
router.post("/paymentmethod", stripe.createPayment);
//moment.js
router.get("/datedemo", users.datedemo);
router.get("/date", users.moment);
router.all("*", checkJwt); // use this auth middleware for ALL subsequent routes

router.get("/user/:id", users.get);
module.exports = router;
