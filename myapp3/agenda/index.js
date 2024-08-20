const Agenda = require("agenda");
require("dotenv").config();

const agenda = new Agenda({
  db: {
    address: process.env.MONGODB_CONNECTION_STRING,
    collection: "agendajobs",
  },
});

// defining jobs
agenda.define("welcomeMessage", () => {
  console.log(`Sending a welcome message `);
});
agenda.define("Hello", () => {
  console.log("Hello world");
});

agenda.on("ready", async () => {
  await agenda.every("3 seconds", "Hello"); // scheduling jobs
  await agenda.start(); // start execution
  console.log("Agenda started");
});
module.exports = agenda;
