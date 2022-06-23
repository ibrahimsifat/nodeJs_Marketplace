const config = require("../config/config");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: config.codenaryCloudName,
  api_key: config.codenaryAPIKEY,
  api_secret: config.codenarySECRET,
});
module.exports = cloudinary;
