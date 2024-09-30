const multer = require('multer');
const path = require('path');

// Set up multer storage for content uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'contentuploads/'); // Files will be stored in the 'contentuploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Name the file with the current timestamp
  },
});

// File filter to allow only images and videos
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mkv/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Only images and videos are allowed!');
  }
};

// Upload middleware
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 10 }, // Limit file size to 10MB
  fileFilter,
});

module.exports = upload;
