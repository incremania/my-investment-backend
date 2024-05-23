
const express = require("express");
const router = express.Router();
const {
createTransfer,
    getUserTransfers
} = require("../controllers/transferController")
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router
  .post(
    "/",
    authenticateUser,
    authorizePermissions("user", "admin"),
    createTransfer
  )
  .get(
    "/",
    authenticateUser,
    authorizePermissions("user", "admin"),
    getUserTransfers
  )

  
module.exports = router;



