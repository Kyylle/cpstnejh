const multer = require('multer');
const path = require('path');

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save files to the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Save file with a timestamp to avoid collisions
  },
});

const upload = multer({ storage: storage });

exports.updateEmployerProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      address,
      phoneNumber,
      website,
      description,
      socialLinks,
      logoURL,
    } = req.body;

    // If files are uploaded (profile photo and background photo)
    let profilePhotoURL = req.files?.profilePhoto ? `/uploads/${req.files.profilePhoto[0].filename}` : undefined;
    let backgroundPhotoURL = req.files?.backgroundPhoto ? `/uploads/${req.files.backgroundPhoto[0].filename}` : undefined;

    // Find the employer by ID and update the profile fields
    const updatedEmployer = await Employer.findByIdAndUpdate(
      id,
      {
        address,
        phoneNumber,
        website,
        description,
        socialLinks,
        logoURL,
        ...(profilePhotoURL && { profilePhotoURL }), // Update only if file is uploaded
        ...(backgroundPhotoURL && { backgroundPhotoURL }), // Update only if file is uploaded
      },
      { new: true }
    );

    if (!updatedEmployer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      employer: updatedEmployer,
    });
  } catch (err) {
    console.error('Error updating employer profile:', err);
    res.status(500).json({ message: 'An internal server error occurred' });
  }
};
