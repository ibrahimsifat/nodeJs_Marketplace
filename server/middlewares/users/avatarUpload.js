const multer = require("multer");
const path = require("path");

module.exports = multer({
  storage: multer.diskStorage({}),
  limits: {
    fileSize: 200000,
  },
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("Only .jpg, jpeg or .png format allowed!"), false);
      return;
    }
    cb(null, true);
  },
});
