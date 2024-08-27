const User = require("../models/user/index");

module.exports = (agenda) => {
  agenda.define("demo", async (job) => {
    try {
      job.remove();
    } catch (error) {
      console.log(`Agenda => ${error}`);
      job.remove();
    }
  });
  // agenda.define("Hello", () => {
  //   console.log("Hello world");
  // });
  agenda.define("welcomeMessage", () => {
    console.log(`Sending a welcome message `);
  });

  // send email
  agenda.define("sendemail", async (job) => {
    const { to, subject, body } = job.attrs.data;
    console.log(`Sending email to ${to} with subject ${subject}`);
  });

  //set isactive to true
  agenda.define("userisactive", async (job) => {
    const { _id } = job.attrs.data;

    const response = await User.findOne({ _id: _id });
    response.isActive = true;
    response.lastActive = new Date();
    await response.save();

    console.log("set isactive to true");
  });

  //set isactive to false
  agenda.define("resetuserisactive", async (job) => {
    const { _id } = job.attrs.data;

    const response = await User.findOne({ _id: _id });
    if (response) {
      response.isActive = false;
      await response.save();

      console.log("set isactive to false");
    }
  });

  agenda.define("demo2", { priority: "high" }, async (job) => {
    const { to } = job.attrs.data;
    console.log(`Hi ${to}`);
  });
};
