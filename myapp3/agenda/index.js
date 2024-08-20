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
agenda.define("sendemail", async (job) => {
  const { to, subject, body } = job.attrs.data;
  console.log(`Sending email to ${to} with subject ${subject}`);
});

agenda.on("ready", async () => {
  //   await agenda.every("3 seconds", "Hello"); // scheduling jobs
  await agenda.start(); // start execution
  console.log("Agenda started");

  // schedule method
  await agenda.schedule("4 seconds", "sendemail", {
    to: "user123@gmail.com",
    subject: "Meeting reminder",
  });
  console.log(`Email scheduled to run at 4 second`);
});
module.exports = agenda;
