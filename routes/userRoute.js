const express = require("express");
const router = express.Router();
const {
  updateUser,
  updatePassword,
  getSingleUser,
  getAllUser,
  showCurrentUser,
  createInvitationCode,
  getAllInvitationCode
} = require("../controllers/userController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router
  .get("/users", getAllUser)
  .get("/show-current-user", authenticateUser, showCurrentUser)
  .post('/invitation', authenticateUser, authorizePermissions("admin"), createInvitationCode)
  .get("/invitations", authenticateUser,  authorizePermissions("admin"), getAllInvitationCode)
  .patch(
    "/update-user",
    authenticateUser,
    authorizePermissions("user", "admin"),
    updateUser
  )
  .patch(
    "/update-password",
    authenticateUser,
    authorizePermissions("user"),
    updatePassword
  )
  .get(
    "/user/:userId",
    authenticateUser,
    authorizePermissions("user", "admin"),
    getSingleUser
  );

module.exports = router;
