// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});
AWS.config.region = process.env.AWS_REGION;
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

      const uniqueFileName = `${uuidv4()}_${files.originalname}`;
      if (!files) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      console.log("File received:", files);
      const response = await s3
        .putObject({
          Bucket: process.env.AWS_BUCKET_FOR_PDF,
          Key: `uploads/${uniqueFileName}`,
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

  async upload(req, res) {
    try {
      const files = req.files;

      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const uploadPromises = files.map((file) => {
        const key = `uploads/${file.originalname}`;
        return s3
          .upload({
            Bucket: process.env.AWS_BUCKET_FOR_PDF,
            Key: key,
            ContentType: file.mimetype,
            Body: file.buffer,
          })
          .promise()
          .then(() => {
            return `https://${process.env.AWS_BUCKET_FOR_PDF}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
          });
      });
      const objectUrls = await Promise.all(uploadPromises);

      return res.status(200).json({ error: false, urls: objectUrls });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: error.message });
    }
  },
};
