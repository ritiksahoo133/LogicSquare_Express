const express = require("express");
const router = express.Router();

const users = {
  "alice@gmail.com": {
    name: "Alice Smith",
    password: "securePassword123",
    date: "2024-07-30",
  },
  "bob@gmail.com": {
    name: "Bob Johnson",
    password: "anotherSecurePassword456",
    date: "2024-07-29",
  },
  "charlie@gmail.com": {
    name: "Charlie Brown",
    password: "yetAnotherSecurePassword789",
    date: "2024-07-28",
  },
};

router.get("/", (req, res) => {
  res.render("chat");
});

router.get("/setUsers", (req, res) => {
  res.cookie("user", JSON.stringify(users), { httpOnly: true });
  res.send("user data is set in cookie");
});
router.post("/getUser", (req, res) => {
  const inputemail = req.body.email;
  const password = req.body.password;

  console.log(inputemail);
  console.log(password);

  const users = JSON.parse(req.cookies.user);
  console.log(typeof users);
  try {
    if (users[email]) {
      res.send(`${email} is present`);
    } else {
      res.status(404).send("user not found");
    }
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
