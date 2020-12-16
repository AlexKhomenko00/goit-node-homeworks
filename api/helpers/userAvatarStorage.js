const multer = require("multer");

const storage = multer.diskStorage({
  destination: "public/images",
  filename: function (req, file, cb) {
    cb(null, req.user.email + ".jpg");
  },
});
module.exports = storage;
