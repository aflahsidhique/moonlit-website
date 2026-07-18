const multer = require("multer");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png"]);

// Files are held in memory just long enough to stream to Cloudinary — never
// written to local disk.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
  fileFilter: function (req, file, cb) {
    if (!ALLOWED_TYPES.has(file.mimetype)) {
      return cb(new Error("Only JPG or PNG files are allowed."));
    }
    cb(null, true);
  }
});

// Streams a multer in-memory file buffer up to Cloudinary and resolves with
// its secure (https) URL.
function uploadToCloudinary(file, folder) {
  return new Promise(function (resolve, reject) {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folder, resource_type: "image" },
      function (err, result) {
        if (err) return reject(err);
        resolve(result.secure_url);
      }
    );
    stream.end(file.buffer);
  });
}

module.exports = { upload, uploadToCloudinary };
