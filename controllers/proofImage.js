const cloudinary = require('cloudinary').v2;
const ProofImage = require('../models/proofImage');

const proofUpload = async (req, res) => {
    try {
        if (!req.files || !req.files.image) {
            return res.status(400).json({ error: 'Please provide a valid image for upload.' });
        }
      
        const proofImage = req.files.image;

        // Check for MIME type
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedMimeTypes.includes(proofImage.mimetype)) {
            return res.status(400).json({ error: 'Only JPEG, PNG, and GIF images are allowed.' });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(proofImage.tempFilePath, {
            use_filename: true,
            folder: 'cryptobase_proof_image'
        });

        // Save reference to the image in your database
        const image = await ProofImage.create({ image: result.secure_url, user: req.user.userId });

        // Respond with the URL of the uploaded image
        res.status(200).json({ image });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const getAllProof = async (req, res) => {
    try {
        // Fetch all proof images and populate the 'user' field to get user information
        const proofs = await ProofImage.find().populate('user');
        

        // Extract relevant information and construct response
        const proofsWithUserNames = proofs.map(proof => ({
            url: proof.image,  // Assuming 'url' is the field where the image URL is stored
            userName: proof.user ? `${proof.user.username} ${proof.user.email}` : 'Unknown'  // Get user name or set to 'Unknown' if user is not available
        }));

        // Respond with the proof images and corresponding user names
        res.status(200).json({ proofs: proofsWithUserNames });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch proof images' });
    }
};



  module.exports = {
    proofUpload,
    getAllProof
  }