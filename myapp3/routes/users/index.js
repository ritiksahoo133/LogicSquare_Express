const express = require("express");
const router = express.Router();
const authJwtMiddleware = require("../../middleware/authmiddlewire");

const user = require("./auth/users");
const login = require("./auth/login");

router.post("/register", user.create);
router.post("/login", login.post);
router.get("/getAllUser", user.getAllUser);
router.get("/getUser", authJwtMiddleware, user.getUser);
router.put("/editprofile", authJwtMiddleware, user.editProfile);

module.exports = router;
