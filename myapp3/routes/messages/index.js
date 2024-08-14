const express = require("express");
const router = express.Router();
const authJwtMiddleware = require("../../middleware/authmiddlewire");

const message = require("../messages/chat");

router.post("/sendmessage", authJwtMiddleware, message.sendmessage);
router.get("/getmessage", authJwtMiddleware, message.getmessage);
router.delete("/:id", authJwtMiddleware, message.deletemessage);
router.get("/getconversation/:id", message.getConversation);

router.get("/notcontaingmail", message.notcontaingmail);

//add location
router.post("/add", message.addlocation);

//near
router.get("/near", message.near);

module.exports = router;
