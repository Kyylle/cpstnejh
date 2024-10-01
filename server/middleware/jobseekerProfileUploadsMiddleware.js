const multer = require('multer');
const path = require('path');

// Set up multer storage for jobseeker profile uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'jobseekerProfileUploads/'); // Files will be stored in the 'jobseekerProfileUploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Name the file with the current timestamp
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Only image files are allowed!'); // Only images are allowed for profile pictures
  }
};

// Upload middleware for jobseeker profile images
const jobseekerProfileUploads = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
  fileFilter,
});

module.exports = jobseekerProfileUploads;
