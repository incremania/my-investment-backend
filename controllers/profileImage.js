const ProfileImage = require('../models/profileImage');
const cloudinary = require('cloudinary').v2

const profileImageUpload = async (req, res) => {
    try {
        if (!req.files || !req.files.image) {
            return res.status(400).json({ error: 'Please provide a valid image for upload.' });
        }
      
        const profileImage = req.files.image;

        // Check for MIME type
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedMimeTypes.includes(profileImage.mimetype)) {
            return res.status(400).json({ error: 'Only JPEG, PNG, and GIF images are allowed.' });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(profileImage.tempFilePath, {
            use_filename: true,
            folder: 'cryptobase_proof_image'
        });

        // Save reference to the image in your database
        const image = await ProfileImage.create({ image: result.secure_url, user: req.user.userId });

        // Respond with the URL of the uploaded image
        res.status(200).json({ image });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const getProfileImageUpload = async (req, res) => {
    try {
        // Extract userId from the request
        const { userId } = req.user;

        // Find the user's profile image in the database
        const image = await ProfileImage.findOne({ user: userId });

        if (!image) {
            return res.status(404).json({ error: 'Profile image not found.' });
        }

        // Respond with the image URL
        res.status(200).json({ image: image.image });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


module.exports = { profileImageUpload, getProfileImageUpload }

