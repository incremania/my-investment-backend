
const express = require("express");
const router = express.Router();
const {
profileImageUpload, getProfileImageUpload
} = require("../controllers/profileImage")
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router
  .post(
    "/profile-image",
    authenticateUser,
    authorizePermissions("user", "admin"),
    profileImageUpload
  )
  .get('/profile-image', authenticateUser, authorizePermissions('user', 'admin'), getProfileImageUpload)
  
module.exports = router;



