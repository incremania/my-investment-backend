const express = require("express");
const router = express.Router();
const {
createInvestment,
getUserInvestments,
getAllInvestment
} = require("../controllers/investController")
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router
  .post(
    "/",
    authenticateUser,
    authorizePermissions("user", "admin"),
    createInvestment
  )
  .get(
    "/",
    authenticateUser,
    authorizePermissions("user", "admin"),
    getUserInvestments
  )
  .get(
    "/all",
    authenticateUser,
    authorizePermissions("admin"),
    getAllInvestment
  )
  
module.exports = router;
