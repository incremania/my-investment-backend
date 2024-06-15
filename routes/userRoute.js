const express = require("express");
const router = express.Router();
const {
  updateUser,
  updatePassword,
  getSingleUser,
  getAllUser,
  showCurrentUser,
  createInvitationCode,
  getAllInvitationCode,
  updatePlan
} = require("../controllers/userController");

const {
  proofUpload,
  getAllProof
} = require('../controllers/proofImage')

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router
  .get("/users", authenticateUser, authorizePermissions('admin'), getAllUser)
  .get("/show-current-user", authenticateUser, showCurrentUser)
  .post('/invitation', authenticateUser, authorizePermissions("admin"), createInvitationCode)
  .get("/invitations", authenticateUser,  authorizePermissions("admin"), getAllInvitationCode)
  .get('/image', authenticateUser, authorizePermissions('admin'), getAllProof)
  .post('/image', authenticateUser, authorizePermissions('user', 'admin'), proofUpload)
  .patch(
    "/update-user",
    authenticateUser,
    authorizePermissions("user", "admin"),
    updateUser
  )
  .patch('/plan', authenticateUser, authorizePermissions('user', 'admin'), updatePlan )
  .post(
    "/update-password",
    authenticateUser,
    authorizePermissions("user", "admin"),
    updatePassword
  )
  .get(
    "/user",
    authenticateUser,
    authorizePermissions("user", "admin"),
    getSingleUser
  );

module.exports = router;
