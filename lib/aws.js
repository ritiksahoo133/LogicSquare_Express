// eslint-disable-next-line import/no-extraneous-dependencies
const AWS = require("aws-sdk");
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});
// AWS.config.region = process.env.AWS_REGION;
const s3 = new AWS.S3();
// recurly.setAPIKey("a5a5ccec30b44dd8860ca92a1449ca31")

module.exports = {
  // uploadFile(file, name) {
  //   // use for user card details
  //   const base64Data = file;
  //   const params = {
  //     Bucket: process.env.AWS_BUCKET_FOR_PDF,
  //     Key: name,
  //     Body: base64Data,
  //     ACL: "public-read",
  //     ContentEncoding: "base64",
  //   };
  //   return new Promise((resolve, reject) => {
  //     s3.upload(params, (err, data) => {
  //       if (err) {
  //         return reject(err);
  //       }
  //       return resolve(data);
  //     });
  //   });
  // },
  async uploadFile(req, res) {
    try {
      const files = req.file;
      console.log(req);

      console.log("file------>", files);
      if (!files) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      console.log("File received:", files);
      const response = await s3
        .putObject({
          Bucket: process.env.AWS_BUCKET_FOR_PDF,
          Key: `uploads/${files.originalname}`,
          ContentType: files.mimetype,
          Body: files.buffer,
        })
        .promise();
      console.log(response);

      return res.status(200).json({ error: false, response });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};
