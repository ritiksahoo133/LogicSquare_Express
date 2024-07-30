const express = require("express");
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/", (req, res) => {
  console.log(req.body.name);
  res.send("Post requests");
});

app.put("/", (req, res) => {
  res.send("Put request");
});
app.delete("/", (req, res) => {
  res.send("Delete request");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
