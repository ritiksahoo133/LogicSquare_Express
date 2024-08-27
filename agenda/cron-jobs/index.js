module.exports = async (agenda) => {
  // Cron job for calculating months of experience of a candidate
  await agenda.cancel({ name: "demo" });
  await agenda.create("demo").repeatEvery("1 day").schedule("11:59pm").save();

  // await agenda.every("2 seconds", "Hello");

  // await agenda.cancel({ name: "welcomeMessage" });
  await agenda.every("10 seconds", "welcomeMessage");

  // send email
  // await agenda.schedule("4 seconds", "sendemail", {
  //   to: "user123@gmail.com",
  //   subject: "Meeting reminder",
  // });
  // console.log(`Email scheduled to run at 4 second`);

  await agenda.cancel({ name: "userisactive" });
  //set isactive to true
  await agenda.now("userisactive", {
    _id: "66c4801d1cd8ace668910130",
  });
  await agenda.cancel({ name: "resetuserisactive" });
  agenda.schedule("2 minutes from now", "resetuserisactive", {
    _id: "66c4801d1cd8ace668910130",
  });

  // await agenda.every("3 seconds", "demo2", {
  //   to: "Ritik",
  // });

  //now
  // await agenda.now("demo2", { to: "Ritik" });

  //agenda.jobs()
  await agenda.cancel({ name: "sendemail" });
  // create method
  const job = await agenda.create("sendemail", {
    to: "user123@gmail.com",
    subject: "Meeting reminder",
  });

  console.log(job);

  await job.schedule("2 minutes from now", "sendemail").save();

  // await agenda.every("5 seconds", "sendemail", {
  //   to: "user123@gmail.com",
  //   subject: "Meeting reminder",
  // });
};
