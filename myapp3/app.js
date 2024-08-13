var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const db = require("./db");
require("dotenv").config();

// var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users/index");
var chatRouter = require("./routes/messages/index");
// var registerRouter = require("./routes/register");
// var newPageRouter = require("./routes/newPage");
// var gameRouter = require("./routes/game");
// var middleWire = require("./middleware/next");
// var conversationRouter = require("./routes/conversation");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use(middleWire);

app.use("/users", usersRouter);
app.use("/message", chatRouter);
// app.use("/register", registerRouter);
// app.use("/newPage", newPageRouter);
// app.use("/game", gameRouter);
// app.use("/conversation", conversationRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
