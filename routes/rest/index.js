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

// stripe
router.post("/createcustomer", stripe.createCustomer);
router.get("/retrievecustomer", stripe.retrieveCustomer);
router.post("/addcard", stripe.cardAdd);
router.delete("/deletecard", stripe.deleteCard);
router.put("/updatecard", stripe.updateCard);
router.post("/createcharge", stripe.createCharge);
router.post("/paymentintent", stripe.paymentIntent);
router.post("/confirmpayment", stripe.confirmpayment);
router.post("/removepaymentmethod", stripe.removeCard);

//create account
router.post("/createaccount", stripe.createAccount);
router.delete("/deleteaccount", stripe.deleteAccount);
router.post("/accountlink", stripe.accountLinkFunc);
router.get("/return", stripe.onboardingComplete);
router.get("/reauth", stripe.reauth);
router.get("/verifyaccountstatus", stripe.verifyAccountStatus);
router.get("/success", stripe.success);
router.get("/failure", stripe.cancel);
router.post("/checkout", stripe.checkout); // checkout
router.post("/createprice", stripe.createprice);
router.post("/refund", stripe.refund);
router.post("/transfer", stripe.transfer);
router.get("/getbalance", stripe.getConnectedAccountBalance);
router.post("/payout", stripe.createPayout);
router.delete("/deletecustomer", stripe.deleteCustomer);

// stripe router
router.post("/createuser", stripe.createuser);
router.post("/createseller", stripe.createseller);
router.post("/verifyconnectedaccount", stripe.verifyConnectedAccount);
router.post("/createproduct", stripe.createProduct);
router.post("/createorder", stripe.createOrder);
router.get("/products", stripe.getproduct);

// stripe ejs page
router.get("/addcustomer", stripe.addcustomer);
router.get("/addvendor", stripe.addvendor);
router.get("/productpage", stripe.productpage);
router.get("/customerorderdetails/:id", stripe.getTransactionDetails);

// moment.js
router.get("/datedemo", users.datedemo);
router.get("/date", users.moment);
router.all("*", checkJwt); // use this auth middleware for ALL subsequent routes

router.get("/user/:id", users.get);
module.exports = router;
