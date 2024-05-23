const express = require("express");
const router = express.Router();
const {
createWithdrawal,
getUserWithdrawals,
updateWithdrawal
} = require("../controllers/withdrawalController")
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router
  .post(
    "/",
    authenticateUser,
    authorizePermissions("user", "admin"),
    createWithdrawal
  )
  .get(
    "/",
    authenticateUser,
    authorizePermissions("user", "admin"),
    getUserWithdrawals
  )
  .patch("/:withdrawalId",authenticateUser, authorizePermissions('admin',), updateWithdrawal)

module.exports = router;

// 167807296